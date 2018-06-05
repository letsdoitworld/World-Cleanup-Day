'use strict';
require('module-util/process').fatalUnhandledRejections();
const service = require('module-service-factory')('auth');
service.use('./plugins/session');
service.use('./plugins/storage');
