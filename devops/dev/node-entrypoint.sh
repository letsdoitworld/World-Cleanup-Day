#!/bin/bash
INIT_FLAG=/.initialized

if [ ! -f "$INIT_FLAG" ]; then
    sudo touch "$INIT_FLAG"
    echo ">>> initializing container..."

    sudo npm i -g -q supervisor

    cd /src && sudo rm -rf node_modules

    for MOD in lucius logger util service-factory; do
        cd /module-${MOD} && sudo yarn link
        cd /src && sudo yarn link "module-${MOD}"
    done

    cd /module-util  && sudo yarn
    cd /module-logger  && sudo yarn
    cd /module-lucius  && sudo yarn link module-logger module-util && sudo yarn
    cd /module-service-factory  && sudo yarn link module-logger && sudo yarn

    (while true; do echo "...installing packages"; sleep 5; done) & PROGRESS_PID=$!
    cd /src && sudo yarn
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
