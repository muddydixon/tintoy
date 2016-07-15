const Fs = require("fs");
const Url = require("url");
const express = require("express");
const ServeStatic = require("serve-static");
const BodyParser = require("body-parser");
const CookieParser = require("cookie-parser");
const Docker = require("dockerode");
const debug = require("debug")("tintoy:app");

class TinToy {
  constructor(opts){
    this.opts = opts;
    const app = this.app = express();

    app.disable("x-powered-by");
    app.use(ServeStatic("public", {index: ["index.html"]}));
    app.use(ServeStatic("node_modules"));
    app.use(BodyParser.json({extends: true}));

    app.use((req, res, next)=>{
      req.docker = this.docker.bind(this);
      next();
    });

    const v1 = express.Router();
    v1.use("/manage/",  require("./manage-handlers")(opts));
    v1.use("/delegate", require("./delegate-handlers")(opts));
    app.use("/v1", v1);

    app.use((err, req, res, next)=>{
      debug(err.stack);
      res.status(500);
      res.json({err: err.message});
    });
  }
  docker(){
    if(this._docker) return this._docker;
    const opts = this.opts;
    const url = Url.parse(opts.dockerhost);
    const option = {};
    if(opts.dockerhost.match(/^unix/) || opts.dockerhost.match(/^unix/)){
      option.socketPath = opts.dockerHost;
    }else{
      option.host     = url.hostname;
      option.port     = +url.port;
      option.protocol = url.protocol === "tcp:" ? "https" : url.protocol.replace(/:$/, "");

      if(this.opts.tlsverify){
        option.ca   = Fs.readFileSync(opts.tlscacert);
        option.cert = Fs.readFileSync(opts.tlscert);
        option.key  = Fs.readFileSync(opts.tlskey);
      }
    };
    return this._docker = new Docker(option);
  }
};
module.exports = TinToy;
