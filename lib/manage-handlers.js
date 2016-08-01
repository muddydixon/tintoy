const OS = require("os");
const Fs = require("fs");
const Url = require("url");
const Path = require("path");
const express = require("express");
const co = require("co");
const Tar = require("tar-fs");
const stream = require("stream");
const _ = require("lodash");
const debug = require("debug")("tintoy:manage");

module.exports = (opts)=>{
  const handlers = express.Router();

  const defaultOptions = {
  };

  const buildImage = (docker, name, dockerfile)=>{
    const dirPath = Path.join(opts.toy.imagesDirPath, name);
    try{
      Fs.mkdirSync(dirPath);
    }catch(err){
      if(err.message.indexOf("EEXIST") !== 0) return Promise.reject(err);
    }
    Fs.writeFileSync(`${dirPath}/Dockerfile`, dockerfile);
    const tar = Tar.pack(dirPath);

    return new Promise((resolve, reject)=>{
      debug(`building ${name} by ${dirPath}.tar`);
      docker.buildImage(tar, {t: `${name}`, rm: true, nocache: true}, (err, stream)=>{
        if(err) return reject(err);

        const onFinished = (err, output)=>{
          debug(`getting  ${name} image inspect`);
          return docker.getImage(`${name}`).inspect((err, info)=>{
            if(err) return reject(err);
            return resolve(info);
          });
        };
        const onProgress = (event)=>{
          // console.log(event.stream);
        };
        return docker.modem.followProgress(stream, onFinished, onProgress);
      });
    });
  };

  const createPortableWriteStream = ()=>{
    const s = stream.Writable();
    s.buf = "";
    s._write = (chunk, encoding, next)=>{
      s.buf += chunk;
    };
    return s;
  };

  const getContainer = (docker, name)=>{
    return new Promise((resolve, reject)=>{
      docker.getContainer(name).inspect((err, info)=>{
        if(err){
          if(err.message.indexOf("(HTTP code 404)") === 0){
            return resolve({});
          }
          return reject(err);
        }
        return resolve(info);
      });
    });
  };

  const runContainer = (docker, options)=>{
    const stdout = createPortableWriteStream();
    const stderr = createPortableWriteStream();

    return new Promise((resolve, reject)=>{
      debug(`starting ${options.Image}`);
      stdout.end = ()=>{
        debug(`stdout: ${stdout.buf}`);
      };
      stderr.end = ()=>{
        debug(`stderr: ${stderr.buf}`);
      };
      docker.run(options.Image, null, [stdout, stderr], options, (err, data, container)=>{
        if(err) return reject(err);
        debug(container);
        debug(data);
        return resolve(data);
      });
    });
  };

  const stopContainer = (docker, name)=>{
    return new Promise((resolve, reject)=>{
      debug(`stopping ${name}`);
      docker.getContainer(name).stop((err, data)=>{
        if(err){
          if(err.message.indexOf("(HTTP code 304) container already stopped") === 0 ||
             err.message.indexOf("(HTTP code 404) no such container") === 0){
            return resolve(null);
          }
          return reject(err);
        }
        return resolve(data);
      });
    });
  };

  const removeContainer = (docker, name)=>{
    return new Promise((resolve, reject)=>{
      debug(`removing ${name}`);
      docker.getContainer(name).remove((err, data)=>{
        if(err){
          if(err.message.indexOf("(HTTP code 304) container already stopped") === 0 ||
             err.message.indexOf("(HTTP code 404) no such container") === 0){
            return resolve(null);
          }
          return reject(err);
        }
        return resolve(data);
      });
    });
  };

  const buildImageAndRunContainer = (docker, name, dockerfile, runoptions)=>{
    return buildImage(docker, name, dockerfile).then((image)=>{
      console.log(runoptions);
      const option = {
        name: `${name}`,
        Image: image.RepoTags[0]
      };
      const PortBindings = {};
      Object.keys(image.Config.ExposedPorts).forEach((p)=>{
        PortBindings[p] = [{HostPort: `${(0|Math.random() * (8192 - 1024)) + 1024}`}];
      });
      option.HostConfig = {};
      option.HostConfig.PortBindings = PortBindings;

      return runContainer(docker, Object.assign(option, defaultOptions)).then((container)=>{
        return {image, container};
      });
    });
  };

  handlers.get("/toys", (req, res, next)=>{
    const docker = req.docker();

    co(function*(){
      const images = yield new Promise((resolve, reject)=>{
        docker.listImages((err, images)=>{
          if(err) return reject(err);
          const tintoys = images.filter((image)=>{
            return image.RepoTags.find((tag)=> tag.indexOf("tintoy_") === 0);
          });
          return resolve(_.flatten(tintoys.map((toy)=>{
            return toy.RepoTags.map((tag)=>{
              if(tag.indexOf("tintoy_") === 0){
                return Object.assign({}, toy, {RepoTags: [tag]});
              }
              return false;
            }).filter((d)=> d);
          })));
        });
      });
      const containers = yield new Promise((resolve, reject)=>{
        docker.listContainers((err, containers)=>{
          if(err) return reject(err);
          return resolve(containers.filter((container)=>{
            return (container.Names[0] || "").indexOf("/tintoy_") === 0;
          }));
        });
      });

      const toys = {};
      images.forEach((image)=>{
        const [prefix, name, version] = image.RepoTags[0].split(/[_:]/);
        if(!toys[name]) toys[name] = {};
        toys[name].name = name;
        toys[name].version = version;
        toys[name].image = image;
        const dockerfilePath = Path.join(opts.toy.imagesDirPath, `tintoy_${name}`, "Dockerfile");
        const dockerfile = Fs.readFileSync(dockerfilePath, {encoding: "utf8"});
        toys[name].dockerfile = dockerfile;
      });
      containers.forEach((container)=>{
        const [prefix, name, tag] = container.Names[0].split(/[_:]/);
        if(!toys[name]) toys[name] = {};
        toys[name].container = container;
      });
      res.json(Object.keys(toys).map((key)=> toys[key]));
    }).catch(next);
  });

  handlers.post("/toys", (req, res, next)=>{
    const name = req.body.name;
    const dockerfile = req.body.dockerfile;
    const runoptions = req.body.runoptions;

    const docker = req.docker();
    co(function*(){
      const resp = yield buildImageAndRunContainer(docker, `tintoy_${name}`, dockerfile, runoptions);
      return {image: resp.image, container: resp.container, name, dockerfile};
    }).then((toy)=>{
      res.json(toy);
    }).catch(next);
  });

  handlers.put("/toys/:toyId", (req, res, next)=>{
    const name = req.params.toyId;
    const dockerfile = req.body.dockerfile;
    const runoptions = req.body.runoptions;

    const docker = req.docker();
    co(function*(){
      const stopData = yield stopContainer(docker, `tintoy_${name}`);
      const removeData = yield removeContainer(docker, `tintoy_${name}`);

      const resp = yield buildImageAndRunContainer(docker, `tintoy_${name}`, dockerfile);
      return {image: resp.image, container: resp.container, name, dockerfile, runoptions};
    }).then((toy)=>{
      res.json(toy);
    }).catch(next);
  });

  handlers.get("/config", (req, res, next)=>{
    const dockerUrl = Url.parse(opts.dockerhost);

    res.json({
      cpus: OS.cpus(),
      loadavg: OS.loadavg(),
      freemem: OS.freemem(),
      totalmem: OS.totalmem(),
      uptime: OS.uptime(),
      hosts: [dockerUrl.hostname],
      ips: ["192.168.0.1", "192.168.0.2"]
    });
  });

  handlers.put("/config", (req, res, next)=>{
    const config = req.body;
    const dockerUrl = Url.parse(opts.dockerhost);
    res.json({
      cpus: OS.cpus(),
      loadavg: OS.loadavg(),
      freemem: OS.freemem(),
      totalmem: OS.totalmem(),
      uptime: OS.uptime(),
      hosts: [dockerUrl.hostname],
      ips: ["192.168.99.100"]
    });
  });

  handlers.get("/:msg", (req, res, next)=>{
    res.json({path: req.originalUrl, msg: req.params.msg});
  });

  return handlers;
};
