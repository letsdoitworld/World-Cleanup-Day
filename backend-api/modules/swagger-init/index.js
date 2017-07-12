'use strict';
const swaggerTools = require('swagger-tools');
const logger = require('module-logger');
const {Lucius, E, LuciusError} = require('module-lucius');
const exceptionFactory = require('module-lucius/error/factory');
const bearerToken = require('express-bearer-token');
const Q = require('q');

const SwaggerSecurityError = exceptionFactory(
    'swaggerSecurityError',
    function (code, message, statusCode = 403, headers = {}) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
        this.headers = headers;
        this.stack = (new Error(message)).stack;
    }
);

const securityHandlers = {
    Roles: async function (req, def, requiredRoles, done) {
        req.securitySync.promise.then(userRole => {
            if (requiredRoles.indexOf(userRole) === -1) {
                return done(new SwaggerSecurityError(
                    'INCORRECT_ACCESS_CAPABILITIES',
                    'The authenticated user does not have one of the roles required for this operation: '
                        + requiredRoles.join(', '),
                    403
                ));
            }
            return done();
        });
    },
    Bearer: async function (req, def, scopes, done) {
        try {
            const lucius = new Lucius(req.seneca);
            const response = await lucius.act('role:auth,cmd:verifyToken', {token: req.token});
            if (response.isSuccessful()) {
                req.securitySync.resolve(); //FIXME: send the user role
                return done();
            } else {
                const invalidTokenError = new SwaggerSecurityError(
                    'INVALID_BEARER_TOKEN',
                    'The provided Bearer token is invalid.',
                    403
                );
                req.securitySync.reject(invalidTokenError);
                return done(invalidTokenError);
            }
        } catch (e) {
            logger.critical(e);
            const fatalError = new SwaggerSecurityError(
                'UNEXPECTED_SECURITY_ERROR',
                'An unexpected error has occured while verifying endpoint security.',
                500
            );
            req.securitySync.reject(fatalError);
            return done(fatalError);
        }
    },
};

const connectErrorHandler = (err, req, res, next) => {
    // Create an error stack in the form we need as per API spec.
    const errors = Lucius.connectErrors('SWAGGER_', true /* force uppercase codes */);
    errors.add(err.code, err.message);

    if (err.failedValidation) {
        logger.error(`SWAGGER: Parameter "${err.paramName}" failed validation:`, req.swagger.params[err.paramName]);
        logger.error(err.code, err.message);
        err.results.errors.map(value => {
            errors.add(value.code, value.message);
            logger.error(value.code, value.message);
        });
        err.results.warnings.map(value => {
            logger.warning(value.code, value.message);
        });
    } else {
        logger.error(`API: ${err.message}`);
        logger.debug(err);
    }

    // don't modify status if another middleware has already changed it
    if (res.statusCode === '200') {
        res.status(500);
    }
    res.json(errors.export());
};

module.exports = {
    attachToConnectApp: (swaggerSpec, connectApp, senecaService, routerOptions) => {
        return new Promise((resolve, reject) => {
            try {
                // Initialize the Swagger middleware.
                swaggerTools.initializeMiddleware(swaggerSpec, swaggerMiddleware => {
                    // Make the Seneca service accessible inside request handlers.
                    connectApp.use((req, res, next) => {
                        req.seneca = senecaService;
                        next();
                    });

                    // Read the "Authorization: Bearer" token into req.token.
                    connectApp.use(bearerToken());

                    // XXX: Use a deferred to force security handlers to execute in a certain order.
                    // The swagger security middleware executes handlers in parallel, but we need
                    // the user identity to be established before we can check her capabilities.
                    // To solve this, the identity checker will resolve or reject the deferred,
                    // and the capability checker will only act if the deferred will resolve.
                    connectApp.use((req, res, next) => {
                        req.securitySync = Q.defer();
                        next();
                    });

                    // XXX: DON'T MODIFY THE ORDER IN WHICH SWAGGER MIDDLEWARES ARE ADDED TO THE CONNECT APP.

                    // Interpret Swagger resources and attach metadata to request.
                    connectApp.use(swaggerMiddleware.swaggerMetadata());

                    // Enforce security on protected endpoints.
                    connectApp.use(swaggerMiddleware.swaggerSecurity(securityHandlers));

                    // Validate requests and responses against the Swagger spec.
                    connectApp.use(swaggerMiddleware.swaggerValidator({validateResponse: true}));

                    // Route validated requests to appropriate controller.
                    connectApp.use(swaggerMiddleware.swaggerRouter(routerOptions));

                    // Serve the Swagger spec and Swagger UI.
                    // This is optional, but recommended to facilitate use if your API is public.
                    connectApp.use(swaggerMiddleware.swaggerUi());

                    // Handle low-level errors (Express or Swagger).
                    connectApp.use(connectErrorHandler);

                    // Resolve with the fully decorated connect app
                    resolve(connectApp);
                });
            } catch (e) {
                reject(e);
            }
        });
    },
};
