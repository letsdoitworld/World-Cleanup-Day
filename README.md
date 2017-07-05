# World-Cleanup-Day

## Backend installation

* The `backend-` and `module-` directories need `yarn install` under each of them.
* The `module-` directories need `yarn link` under each of them.
* The `backend-` directories need to `yarn link module-name` to each of the modules.
* Then you can issue `docker-compose up -d` from under `devops/backend`.
