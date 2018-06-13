#!/bin/bash
source .env
envsubst < app-template.yml > app.yml
#env $(cat .api | grep ^[A-Z] | xargs)
docker stack deploy -c app.yml --with-registry-auth app
