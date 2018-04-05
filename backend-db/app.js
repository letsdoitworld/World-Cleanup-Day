'use strict';
require('module-util/process').fatalUnhandledRejections();
const service = require('module-service-factory')('db');
service.use('./plugins/accounts');
service.use('./plugins/datasets');
service.use('./plugins/trashpoints');
service.use('./plugins/images');
service.use('./plugins/areas');
service.use('./plugins/teams');
