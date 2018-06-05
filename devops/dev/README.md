# Development setup

This directory contains recipes for running the backend services on the local machine, using docker containers and docker-compose for managing them.

## Requirements

docker and docker-compose.

Please make sure you have enough disk space in the location where docker saves its images. That location varies depending on operating system. Several GB are usually recommended (at least 10 GB is a good rule of thumb).

Linux is highly recommended. Performance on other operating systems can vary greatly.

## Quick start

    docker-compose build && docker-compose up -d && docker-compose ps

Confirm that the `ps` output lists all containers as running.

Connect to `http://localhost:5984/_utils/` to reach the CouchDB web interface (user+password are `user` and `password`).

You can reach the `api` service on `http://localhost:50000`. For example `http://localhost:50000/api/v1/datasets` should come back with a dataset list if everything works ok. If not, see the `logs` command for what went wrong. See the Swagger definition in `backend-api/api/v1.0.yaml` for more endpoints.

## Overview

### Short introduction

The files in this directory can help you create a fully working backend without affecting the rest of your workstation.

Docker is a tool that can create self-contained virtual containers that can be overlayed transparently over your host system without actually changing anything, and use the host CPU and RAM.

Docker-Compose is a tool that simplifies docker container creation and management.

### How containers are set up

There are 4 distinct services, each using its own container, running Node.JS 8.1.2 apps, plus one container running a CouchDB 1.6.1 database. See `docker-compose.yaml` for the details.

The setup assumes that this directory is located in a certain position relative to the other directories in the project. The `.env` file contains variables that can be customized if that assumption is not true. Also see `.env` files under each `services/` subdir, they each contain vars relevant to a single service.

The Node services will attempt to map the other directories in the project (the `backend-*` dirs) to the service containers. Normally, the containers are self-contained and fully isolated from the host machine. However, we map the dirs containing the service code to the host, so that any change you make is instantly propagated to the containers. The Node apps run through a tool called `supervisor` which will automatically restart the apps whenever `.js` or `.yaml` files are changed.

The CouchDB container also maps its database files to the host, as well as the config file. This way the configuration and the data will persist even if the container is destroyed and later recreated.

### If you know docker-compose

For seasoned users of docker-compose:

* See definitions in `docker-compose.yaml`.
* CouchDB uses the official 1.6.1 image directly, with no additional setup other than mapping the data and config files to the host.
* The Node services are based on Ubuntu and each contain a fully functional (albeit minimal) Ubuntu server installation.
* The Node services use an entrypoint script because they need to perform certain operations after container initialization:
  * Initializing external NPM modules.
  * Linking the services to the internal modules (from the project `module-*` dirs) locally, using `yarn link`. This allows changes to the modules to also be instantly propagated to the apps running in the containers.
* Each Node service exposes a debug connection which can be used from an IDE such as VSCode. See `.env` for port mapping details.

### If you don't know docker-compose

    docker-compose build

Rebuilds the container images and publishes/updates them in the local docker registry on your workstation. This typically needs to be done only once, unless you change something in the recipes.

    docker-compose up -d

Raises the virtual machines in the containers and runs them in the background. This command will cause each container to go through its initialization procedure again. For the Node services this means running the entrypoint script. You can watch the progress using the `logs` command.

    docker-compose ps

Lists the raised containers, their current states (running, stopped etc.) and the network ports used by each.

    docker-compose stop [container name]
    docker-compose start
    docker-compose restart

Stops/starts/restarts all or individual containers without destroying the container.

    docker-compose down

Powers down and destroys the containers. This is useful when you change the recipes. Tipically followed by a rebuild and raising the containers again. Please note that this command will lose any change that you made *inside* the container – with the notable exception of dirs that were mapped to real dirs on the host.

    docker-compose logs -f

Displays a running log of all containers combined. There are also options that allow you to see the logs from only individual containers, or combinations of them, or limit the output to only the most recent N files.

    docker-compose exec api bash

Runs `bash` inside the `api` container. Effectively drops you into the console inside the `api` service's virtual machine. You can also run other commands in this manner. You can use this to verify that all files are as they should, diagnose issues, explore network connections etc. You can install packages with `apt` and generally do whatever you do. Just remember that everything will be lost when you `down` the containers.

See the docker compose help (online, man pages, and `docker-compose help`) for more details.
