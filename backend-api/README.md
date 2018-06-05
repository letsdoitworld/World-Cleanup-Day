# LDIW backend-api

## About

Microservice written with Node, Express, Swagger and Seneca.

## Configuration

Environment variables that will affect the service are defined and documented in `container.env`. Additionally, when running under docker-compose, they can be overwritten by the `.env` file at the compose base dir.

## Swagger definitions

The Swagger API definitions are stored in `api/vN.json` files, where `N` is a version such as `1.0`. You can specify the version `N` with the `API_VERSION` environment variable. It defaults to `1.0`.

## Running

You need to run `node app.js`.

Developers are advised to run it through a file watcher and restarter such as `supervisor`.

The devops repository contains docker-compose recipes for running this inside a container.

The service runs by default on port 80. If you want to override that you can change the environment variable `API_PORT` and/or map the host port to something else in the container recipe. Please note that the container definition also needs to know what the port is, so it can map it to the host, so if you're running in a container please remember to set it in the `.env` file next to `docker-compose.yaml` (it will overwrite the local value).

Please note that the value of `host` and `port` below change depending on whether you run the service directly or inside a container. If you run it directly, it will most likely be `0.0.0.0:80`. If you run it in a container, the values depend on what the container maps them to.

Once up and running, the following URLs should be accessible:

* `http://host:port/api/v1`: the REST API.
  * Please see the definitions in the `api/*.yaml` files for the actual URL suffix, because each version defines its own.
* `http://host:port/docs`: the API documentation (only when `NODE_ENV` is `development`).
* `http://host:port/api-docs`: the API specification (Swagger 2.0 in JSON format) (only when `NODE_ENV` is `development`).

## Git strategy

`develop` is the main development branch.

Development is done in feature branches prefixed with `feature/`. Merge from a feature to `develop` is done via requests, which imply code review, QA testing and automated testing (including unit testing, linting, type checking etc.)

Releases are done via release candidate branches crafted for specific purposes from `develop` branch or from `live/` tags, plus hand-picked features, testing, and bug fixes. A release candidate is tagged `live/` once it has been deployed and deemed stable. `live/` tags MUST be signed.
