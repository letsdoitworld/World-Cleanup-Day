#!/bin/bash
source .env
envsubst < proxy-template.yml > proxy.yml
docker stack deploy -c proxy.yml --with-registry-auth proxy
