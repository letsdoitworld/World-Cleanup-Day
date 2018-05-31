#!/bin/bash
source .env
envsubst < infrastructure-template.yml > infrastructure.yml
docker stack deploy -c infrastructure.yml --with-registry-auth infra
