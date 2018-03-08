#!/bin/bash -e

set -x
ls -la
hostname

whoami

eval `ssh-agent -s`
ssh-add ~/.ssh/id_rsa
cd backend-prod

# change subrepos.ini according to env_label
sed -e s/'DEFAULT_BRANCH=.*'/"DEFAULT_BRANCH=$REPOS_BRANCH"/g -i subrepos.ini


./get_subrepos.sh

# BUILD STATIC web-app
cd $WORKSPACE/backend-prod/services/web-app
mv services/web-app/* .

echo "export const API_URL = \"$API_URL\";" > env.js

./build_static.sh
cd ../../


docker-compose -f docker-compose.yaml build

TAGGED_IMAGES=""
IMAGES=$(docker images -q --filter reference=backendprod*)
TAG1="latest"
TAG2="$BUILD_NUMBER"
for i in $IMAGES;do
  SERVICE_NAME=$(docker inspect $i --format '{{index .RepoTags 0 }}' | sed -e 's/\[//g' -e 's/\]//g' | sed -e "s/backendprod_//g" | sed -e 's/:latest//g')

  NEW_NAME="registry.ops.worldcleanupday.com/"$SERVICE_NAME"-${ENV_LABEL}:$TAG1"
  NEW_NAME2="registry.ops.worldcleanupday.com/"$SERVICE_NAME"-${ENV_LABEL}:$TAG2"

  # create new tag for build image
  echo "Tagging latest image (NEW_NAME) with name: $NEW_NAME"
  docker tag $i $NEW_NAME
  echo "Tagging built image with build_number: $NEW_NAME2"
  docker tag $i $NEW_NAME2

  # add images to image list
  TAGGED_IMAGES="$TAGGED_IMAGES $NEW_NAME $NEW_NAME2"
done
echo "These images were tagged and should be published:"
for i in $TAGGED_IMAGES; do
  echo $i
done

echo "TAGGED_IMAGES=$TAGGED_IMAGES" > file.properties
echo "CLUSTER_NETWORK_NAME=$CLUSTER_NETWORK_NAME" >> file.properties
echo "DELETE_EXISTING_DATABASES=$DELETE_EXISTING_DATABASES" >> file.properties