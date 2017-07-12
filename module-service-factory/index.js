'use strict';
const Seneca = require('seneca');
const logHandler = require('./modules/loggers/verbose');
const logger = require('module-logger');

module.exports = serviceName => {
    // prepare options
    const SENECA_TIMEOUT = parseInt(process.env.SENECA_TIMEOUT || 10000);
    const SENECA_LOG_LEVEL = process.env.SENECA_LOG_LEVEL || 'quiet';

    // make new service instance
    const seneca = Seneca({
        SENECA_TIMEOUT,
        SENECA_LOG_LEVEL,
        internal: {
            logger: logHandler,
        },
    });

    // error handling configuration
    seneca.fixedargs.fatal$ = false;

    // set up inter-service connection routing
    switch (serviceName) {
        case 'api':
            seneca.client({
                host: 'auth',
                port: process.env.SERVICE_PORT || 80,
                pin: 'role:auth',
            });
        break;
        case 'auth':
            seneca.listen({
                port: process.env.SERVICE_PORT || 80,
                pin: 'role:auth',
            });
            seneca.client({
                host: 'db',
                port: process.env.SERVICE_PORT || 80,
                pin: 'role:db',
            });
        break;
        case 'db':
            seneca.listen({
                port: process.env.SERVICE_PORT || 80,
                pin: 'role:db',
            });
        break;
    }

    // log when starting successfully
    seneca.ready(() => {
        logger.info(`SENECA: service "${serviceName}" has started.`);
        logger.debug('Environment variables:', process.env);
    });

    return seneca;
};
