#!/bin/bash
set -x
# move everything to the shared file system
mkdir -p /opt/deploy/workspace
cp -a $WORKSPACE /opt/deploy/workspace
WORKSPACE=/opt/deploy/workspace/$JOB_NAME
cd $WORKSPACE


docker stack rm app || true
# wait for couchbase to clear filesystem locks
sleep 10


eval `ssh-agent -s`
ssh-add /root/.ssh/id_rsa

cp -a devops/backend-prod/.env ${ENV_LABEL}/app/.globalenv
cp -a devops/backend-prod/services/backend-api/.env ${ENV_LABEL}/app/api.env
cp -a devops/backend-prod/services/backend-auth/.env ${ENV_LABEL}/app/auth.env
cp -a devops/backend-prod/services/backend-db/.env ${ENV_LABEL}/app/db.env
cp -a devops/backend-prod/services/backend-geo/.env ${ENV_LABEL}/app/geo.env
#cp -a devops/backend-prod/services/couchbase/local.ini ${ENV_LABEL}/app/local.ini
cp -a devops/backend-prod/services/couchdb/etc/local.ini ${ENV_LABEL}/app/local.ini
cp -a devops/backend-prod/services/couchdb/.env ${ENV_LABEL}/app/couchdb.env


cd ${ENV_LABEL}/app
sed -e s/"ENV_LABEL=.*"/"ENV_LABEL=$ENV_LABEL"/g -i .env

# change auth.env
sed -e "s#JWT_SECRET=.*#JWT_SECRET=$JWT_SECRET#g" -i auth.env
sed -e "s#AZURE_STORAGE_ACCESS_KEY=.*#AZURE_STORAGE_ACCESS_KEY=$AZURE_STORAGE_ACCESS_KEY#g" -i auth.env
sed -e "s#AZURE_STORAGE_ACCOUNT=.*#AZURE_STORAGE_ACCOUNT=$STORAGE_ACCOUNT#g" -i auth.env
sed -e "s#COUCHDB_USER=.*#COUCHDB_USER=$COUCHDB_USER#g" -i .globalenv
sed -e "s#COUCHDB_PASSWORD=.*#COUCHDB_PASSWORD=$COUCHDB_PASSWORD#g" -i .globalenv

# add couch url add end of db.env
echo "COUCHBASE_ENDPOINT=$COUCHBASE_ENDPOINT" >> db.env

./deploy_app.sh
echo "Giving the cluster time to start all containers.."
sleep 120