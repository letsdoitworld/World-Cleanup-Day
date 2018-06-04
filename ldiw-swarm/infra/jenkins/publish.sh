#/bin/bash

set +x
# docker rmi $(docker images -q --filter dangling=true) || true

# push image tags to registry
for i in $TAGGED_IMAGES; do
  echo "Pushing image $i to registry.."
  docker push $i
  if [ $? != "0" ];then echo "Push failed! exiting..";exit 1;fi
  echo "Removing local image."
  docker rmi $i -f
done

docker rmi $(docker images -q --filter reference=backend*) -f || true