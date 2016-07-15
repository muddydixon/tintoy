const http = require("http");
const Path = require("path");
const config = require("config");
const commander = require("commander");
const debug = require("debug")("tintoy");
const TinToy = require("./lib/tintoy");

process.title = config.name;

const DOCKER_CERT_PATH = process.env.DOCKER_CERT_PATH || "";
const program = commander
        .option("-p,--port <PORT>", "PORT", Number, process.env.PORT)
        .option("-d,--dockerhost <DOCKER_HOST>", "docker host", String, process.env.DOCKER_HOST)
        .option("-n,--network <DOCKER_NETWORK>", "docker network", String, process.env.DOCKER_NETWORK || "hubot")
        .option("--tls <DOCKER_TLS>", "docker tls", Boolean, process.env.DOCKER_TLS || false)
        .option("--tlsverify <DOCKER_TLS_VERIFY>", "docker tls verify", Boolean,
                process.env.DOCKER_TLS_VERIFY || false)
        .option("--tlscacert <DOCKER_TLS_CACERT>", "docker tls cacert", String,
                process.env.DOCKER_TLS_CACERT || Path.join(DOCKER_CERT_PATH, "ca.pem"))
        .option("--tlscert <DOCKER_TLS_CERT>", "docker tls cert", String,
                process.env.DOCKER_TLS_CERT || Path.join(DOCKER_CERT_PATH, "cert.pem"))
        .option("--tlskey <DOCKER_TLS_KEY>", "docker tls key", String,
                process.env.DOCKER_TLS_KEY || Path.join(DOCKER_CERT_PATH, "key.pem"))
        .option("--crt <SSH_CRT>", "ssh crt", String,
                process.env.SSH_CRT)
        .option("--crtkey <SSH_KEY>", "ssh key", String,
                process.env.SSH_KEY)
        .parse(process.argv);

const comOpts = {};
Object.keys(program._events).forEach((key)=>{
  if(typeof program[key] !== "undefined") comOpts[key] = program[key];
});

const opts = Object.assign({}, config, comOpts);

const tintoy = new TinToy(opts);

const server = http.createServer(tintoy.app);
server.listen(opts.port);
server.on("listening", ()=>{
  console.log(`start on ${opts.port}`);
});
