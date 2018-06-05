# This is a common NodeJS setup reused by all node-based containers in this
# project. Please remember that if you change it you will be affecting several
# containers.

FROM node:8.1.2
MAINTAINER LDIW

# following commands run as root
USER root

# install system packages required for building binary node modules
RUN apt-get -q update
RUN apt-get -q -y install sudo build-essential

# allows the 'node' user to sudo without a password
RUN echo "%sudo ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
RUN adduser node sudo

# prepare the script that will run commands on every container `up`
ADD ./node-entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh

# script runs as user 'node'
WORKDIR /src
USER node
ENTRYPOINT ["/entrypoint.sh"]
