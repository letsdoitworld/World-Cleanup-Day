'use strict';
require('module-util/process').fatalUnhandledRejections();
const express = require('express');
const yaml = require('js-yaml');
const fs = require('fs');
const apiService = require('module-service-factory')('api');
const logger = require('module-logger');
const swaggerSetup = require('./modules/swagger-setup');

// Configuration for the Swagger routers.
const SWAGGER_ROUTER_OPTIONS = {
    controllers: './api/controllers',
    ignoreMissingHandlers: true,
    // Conditionally turn on stubs (mock mode)
    useStubs: process.env.MOCK_API === 'true',
};

// Get the Swagger spec loaded as internal data object.
const API_VERSION = process.env.API_VERSION || '1.0';
const API_SPEC_FILE = `./api/v${API_VERSION}.yaml`;
const swaggerDefinition = yaml.safeLoad(fs.readFileSync(API_SPEC_FILE, 'utf8'));
logger.info(`API: Loaded specification from: ${API_SPEC_FILE}`)

// We use Express as the main transport.
const app = express();

// Add Swagger capabilities to the transport app.
swaggerSetup.attachToConnectApp(swaggerDefinition, app, apiService, SWAGGER_ROUTER_OPTIONS)
.then(appWithSwagger => {
    // Start the server.
    const API_PORT = process.env.API_PORT || 80;
    appWithSwagger.listen(API_PORT, '0.0.0.0', null, () => {
        logger.info(`API: running on port ${API_PORT}.`);
    });
});
