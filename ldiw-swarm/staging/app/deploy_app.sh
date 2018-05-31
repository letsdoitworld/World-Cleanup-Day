#!/bin/bash
source .env
envsubst < app-template.yml > app.yml
docker stack deploy -c app.yml --with-registry-auth app${ENV_LABEL}
