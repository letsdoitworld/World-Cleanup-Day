#!/bin/bash
set +x
# move everything to the shared file system
mkdir -p /opt/deploy/workspace
cp -a $WORKSPACE /opt/deploy/workspace
WORKSPACE=/opt/deploy/workspace/$JOB_NAME
cd $WORKSPACE

if $DELETE_EXISTING_DATABASES; then
	dbs=$(curl -ubackenddb:rockychrome -XGET https://couch-qa.app.worldcleanupday.com/_all_dbs |  sed -e s/\"//g -e s/_replicator//g -e s/,//g -e s/_users//g -e 's/\[//g' -e 's/\]//g')
    for i in $dbs; do
    	curl -ubackenddb:rockychrome -XDELETE https://couch-qa.app.worldcleanupday.com/$i;
    done
fi

docker stack rm app${ENV_LABEL} || true
# wait for couchdb to clear filesystem locks
sleep 10


eval `ssh-agent -s`
ssh-add /root/.ssh/id_rsa

cp -a devops/backend-prod/.env staging/app/.globalenv
cp -a devops/backend-prod/services/backend-api/.env staging/app/api.env
cp -a devops/backend-prod/services/backend-auth/.env staging/app/auth.env
cp -a devops/backend-prod/services/backend-db/.env staging/app/db.env
cp -a devops/backend-prod/services/backend-geo/.env staging/app/geo.env
#cp -a devops/backend-prod/services/couchbase/local.ini staging/app/local.ini
cp -a devops/backend-prod/services/couchdb/etc/local.ini staging/app/local.ini
cp -a devops/backend-prod/services/couchdb/.env staging/app/couchdb.env

# change subrepos.ini according to env_label
#if [ $ENV_LABEL == "qa" ]; then
#  sed -e s/'DEFAULT_BRANCH=.*'/'DEFAULT_BRANCH=develop'/g -i subrepos.ini
#fi
#
#if [ $ENV_LABEL == "staging" ] || [ $ENV_LABEL == "production" ]; then
#  sed -e s/'DEFAULT_BRANCH=.*'/'DEFAULT_BRANCH=master'/g -i subrepos.ini
#fi
cd staging/app
sed -e s/"ENV_LABEL=.*"/"ENV_LABEL=$ENV_LABEL"/g -i .env

# change auth.env
sed -e "s#JWT_SECRET=.*#JWT_SECRET=$JWT_SECRET#g" -i auth.env
sed -e "s#AZURE_STORAGE_ACCESS_KEY=.*#AZURE_STORAGE_ACCESS_KEY=$AZURE_STORAGE_ACCESS_KEY#g" -i auth.env
sed -e "s#AZURESTORAGE_ACCOUNT=.*#AZURESTORAGE_ACCOUNT=$AZURESTORAGE_ACCOUNT#g" -i auth.env
sed -e "s#COUCHDB_USER=.*#COUCHDB_USER=$COUCHDB_USER#g" -i .globalenv
sed -e "s#COUCHDB_PASSWORD=.*#COUCHDB_PASSWORD=$COUCHDB_PASSWORD#g" -i .globalenv

# add couch url add end of db.env
#echo "COUCHBASE_ENDPOINT=$COUCHBASE_ENDPOINT" >> db.env

# Perform some env variable changes for STAGING
#if [ $ENV_LABEL == "staging" ]; then
#  sed -e s/"RGNETS_DEBUG_MODE=.*"/"RGNETS_DEBUG_MODE=$RGNETS_DEBUG_MODE"/g -i logic.env
#fi

./deploy_app.sh
echo "Giving the cluster time to start all containers.."
sleep 120

# restart the proxy for STAGING and QA

# TODO
#if [ $ENV_LABEL == "staging" ] || [ $ENV_LABEL == "qa" ]; then
#  echo "Restart the proxy stack"
#  docker service rm proxy_proxy
#  cd ${WORKSPACE}/staging
#  ./deploy_proxy.sh
#  sleep 10
#  cd $WORKSPACE/infra && ./deploy_proxy.sh
#fi
# end TODO