'use strict';
require('module-util/process').fatalUnhandledRejections();
const service = require('module-service-factory')('geo');
service.use('./plugins/areas');
