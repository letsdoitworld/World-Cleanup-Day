#!/bin/bash

set -x
# move everything to the shared file system
mkdir -p /opt/deploy/workspace
cp -a $WORKSPACE /opt/deploy/workspace
WORKSPACE=/opt/deploy/workspace/$JOB_NAME
cd $WORKSPACE/${ENV_LABEL}


# Check tasks to do
if $DEPLOY_PROXY; then
    docker stack rm proxy
    ./deploy_proxy.sh
fi

if $DEPLOY_CERTBOT; then
    docker stack rm certbot
    ./deploy_certbot.sh
fi

if $DEPLOY_INFRA; then
    docker stack rm infra
    ./deploy_infra.sh
fi