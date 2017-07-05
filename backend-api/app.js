'use strict';
const express = require('express');
const swaggerTools = require('swagger-tools');
const yaml = require('yamljs');
const apiService = require('module-service-factory')('api');
const logger = require('module-logger');

logger.info('Environment variables:', process.env);

// swaggerRouter configuration
const SWAGGER_ROUTER_OPTIONS = {
    controllers: './api/controllers',
    // Conditionally turn on stubs (mock mode)
    // useStubs: process.env.MOCK_API === 'true' ? true : false,
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const API_VERSION = process.env.API_VERSION || '1.0';
const API_SPEC_FILE = `./api/v${API_VERSION}.yaml`;
const swaggerDefinition = yaml.load(API_SPEC_FILE);
logger.info(`Loaded specification from: ${API_SPEC_FILE}`)

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDefinition, (swaggerMiddleware) => {
    const app = express();

    // Make Seneca available inside request handlers.
    app.use((req, res, next) => {
        req.seneca = apiService;
        next();
    });

    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(swaggerMiddleware.swaggerMetadata());

    // Validate Swagger requests
    app.use(swaggerMiddleware.swaggerValidator());

    // Route validated requests to appropriate controller
    app.use(swaggerMiddleware.swaggerRouter(SWAGGER_ROUTER_OPTIONS));

    // Serve the Swagger documents and Swagger UI
    app.use(swaggerMiddleware.swaggerUi());

    // Start the server
    const API_PORT = process.env.API_PORT || 80;
    app.listen(API_PORT, '0.0.0.0', null, () => {
        logger.info(`REST API is running on port ${API_PORT}.`);
    });
});
