#!/bin/bash
docker stack rm app${ENV_LABEL} || true
# wait for couchdb to clear filesystem locks
sleep 10

set +x

eval `ssh-agent -s`
ssh-add /root/.ssh/id_rsa_jenkins
rm -rf app/services
cd devops

# change subrepos.ini according to file.properties from build stage

sed -e s/'DEFAULT_BRANCH=.*'/"DEFAULT_BRANCH=$REPOS_BRANCH"/g -i subrepos.ini


sed "2i BRANCH_api=$BRANCH_api" -i subrepos.ini
sed "3i BRANCH_identity=$BRANCH_identity" -i subrepos.ini
sed "4i BRANCH_dashboard=$BRANCH_dashboard" -i subrepos.ini
sed "5i BRANCH_logic=$BRANCH_logic" -i subrepos.ini
sed "6i BRANCH_data=$BRANCH_data" -i subrepos.ini
sed "7i BRANCH_nexudus=$BRANCH_nexudus" -i subrepos.ini
sed "8i BRANCH_messaging=$BRANCH_messaging" -i subrepos.ini
sed "9i BRANCH_doors=$BRANCH_doors" -i subrepos.ini
sed "10i BRANCH_rgnets=$BRANCH_rgnets" -i subrepos.ini
sed "11i BRANCH_doorflow=$BRANCH_doorflow" -i subrepos.ini
sed "12i BRANCH_couchdb=$BRANCH_couchdb" -i subrepos.ini
sed "13i BRANCH_booking=$BRANCH_booking" -i subrepos.ini
sed "14i BRANCH_community=$BRANCH_community" -i subrepos.ini

./get_subrepos_jenkins.sh
mv services ../app/
mv *env ../app/
cd ../app
sed -e s/"ENV_LABEL=.*"/"ENV_LABEL=$ENV_LABEL"/g -i .env

# Change swagger config to point to correct api url
sed -e "7s/host:.*/host: runspace-${ENV_LABEL}.qualitance.com/g" -e "s/schemes.*/schemes:/g" -e "10s/#//g" -i services/api/swagger/api/swagger/v1.0.yaml

./deploy_app.sh
echo "Giving the cluster time to start all containers.."
sleep 120