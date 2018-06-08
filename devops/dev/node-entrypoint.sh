#!/bin/bash
INIT_FLAG=/.initialized

if [ ! -f "$INIT_FLAG" ]; then
    sudo touch "$INIT_FLAG"
    echo ">>> initializing container..."

    sudo npm i -g -q supervisor

    cd /src && sudo rm -rf node_modules

    for MOD in lucius logger util service-factory; do
        cd /module-${MOD} && yarn link
        cd /src && yarn link "module-${MOD}"
    done

    cd /module-util && rm -rf node_modules && yarn
    cd /module-logger && rm -rf node_modules && yarn
    cd /module-lucius && rm -rf node_modules && yarn link module-logger module-util && yarn
    cd /module-service-factory && rm -rf node_modules && yarn link module-logger && yarn

    (while true; do echo "...installing packages"; sleep 5; done) & PROGRESS_PID=$!
    cd /src && yarn
    kill "$PROGRESS_PID" &>/dev/null

    echo "<<< initialization done"
fi

exec sudo -E /usr/local/bin/supervisor \
--watch /src/ \
--extensions js,yaml \
-- \
--inspect=0.0.0.0:${DEBUG_PORT} \
--nolazy \
/src/app.js
