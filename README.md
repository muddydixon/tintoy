TinToy
-----

* Dockerfile executing environment.
* Prototype sandbox.

## How to install on standalone

```zsh
% docker info
# check docker status
% git clone https://github.com/muddydixon/tintoy.git
% cd tintoy
% npm install
% npm run web:watch
% npm run dev
% open http://localhost:6300
```

## How to install on

```zsh
% docker info
# check docker status
% git clone https://github.com/muddydixon/tintoy.git
% cd tintoy
% npm install
% npm run web:watch
% DOCKER_HOST=tcp://XXX.XXX.XXX.XXX:2376 \
  DOCKER_TLS_VERIFY=1 \
  DOCKER_CERT_PATH=${YOUR_DOCKER_CERT_PATH} \
  npm run dev
% open http://localhost:6300
```
