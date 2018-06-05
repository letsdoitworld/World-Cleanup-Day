'use strict';
const swaggerTools = require('swagger-tools');
const bearerToken = require('express-bearer-token');
const morgan = require('morgan');
const cors = require('cors');
const securityMw = require('./middleware/security');
const errorMw = require('./middleware/error');

const NODE_ENV = process.env.NODE_ENV;

module.exports = {
    attachToConnectApp: (swaggerSpec, connectApp, senecaService, routerOptions) => {
        return new Promise((resolve, reject) => {
            try {
                // Initialize the Swagger middleware.
                swaggerTools.initializeMiddleware(swaggerSpec, swaggerMw => {
                    // Log all HTTP requests.
                    connectApp.use(morgan(
                        ':date[iso] - HTTP: [RESP] :remote-addr :method :url'
                            + ' :status :res[content-length] - :response-time ms'
                    ));
                    connectApp.use(morgan(
                        ':date[iso] - HTTP: [REQ] :remote-addr :method :url',
                        {immediate: true}
                    ));

                    // Add CORS headers for the benefit of web apps.
                    connectApp.use(cors());

                    // Create a request property where we place our own payloads.
                    connectApp.use((req, res, next) => {
                        req.__ = {};
                        // Information about the logged-in user.
                        req.__.user = {};
                        req.__.session = {};
                        // Make the Seneca service accessible inside request handlers.
                        req.__.seneca = senecaService;
                        next();
                    });

                    // Read the "Authorization: Bearer" token into req.token.
                    connectApp.use(bearerToken());

                    // XXX: DON'T MODIFY THE ORDER IN WHICH SWAGGER MIDDLEWARES ARE ADDED TO THE CONNECT APP.

                    // Interpret Swagger resources and attach metadata to request.
                    connectApp.use(swaggerMw.swaggerMetadata());

                    // Enforce security on protected endpoints.
                    connectApp.use(securityMw);

                    // Validate requests and responses against the Swagger spec.
                    connectApp.use(swaggerMw.swaggerValidator({
                        validateResponse: true,
                    }));

                    // Route validated requests to appropriate controller.
                    connectApp.use(swaggerMw.swaggerRouter(routerOptions));

                    // Serve the Swagger spec and Swagger UI. This middleware is optional.
                    if (NODE_ENV === 'development') {
                        connectApp.use(swaggerMw.swaggerUi());
                    }

                    // Handle low-level errors (Express or Swagger).
                    connectApp.use(errorMw);

                    // Resolve with the fully decorated connect app
                    resolve(connectApp);
                });
            } catch (e) {
                reject(e);
            }
        });
    },
};
