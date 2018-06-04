#!/bin/bash
source .env
envsubst < certbot-template.yml > certbot.yml
docker stack deploy -c certbot.yml --with-registry-auth certbot
