'use strict';
const Seneca = require('seneca');
const logHandler = require('./modules/loggers/verbose');
const logger = require('module-logger');
const logFormat = logger.formatter('SENECA');

const SENECA_TIMEOUT = parseInt(process.env.SENECA_TIMEOUT) || 10000;
const SENECA_LOG_LEVEL = process.env.SENECA_LOG_LEVEL || 'quiet';
const SERVICE_PORT = process.env.SERVICE_PORT || 80;
const SENECA_PROTOCOL = 'http';

module.exports = serviceName => {
    // set options common to all instances
    const seneca = Seneca({
        transport: {
            'http': {
                timeout: SENECA_TIMEOUT,
            },
            'tcp': {
                timeout: SENECA_TIMEOUT,
            },
        },
        log: SENECA_LOG_LEVEL,
        // timeout: SENECA_TIMEOUT,
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
            type: SENECA_PROTOCOL,
            host: 'auth',
            port: SERVICE_PORT,
            pin: 'role:auth',
        });
        seneca.client({
            type: SENECA_PROTOCOL,
            host: 'db',
            port: SERVICE_PORT,
            pin: 'role:db',
        });
        break;
    case 'auth':
        seneca.listen({
            type: SENECA_PROTOCOL,
            port: SERVICE_PORT,
            pin: 'role:auth',
        });
        seneca.client({
            type: SENECA_PROTOCOL,
            host: 'db',
            port: SERVICE_PORT,
            pin: 'role:db',
        });
        break;
    case 'db':
        seneca.listen({
            type: SENECA_PROTOCOL,
            port: SERVICE_PORT,
            pin: 'role:db',
        });
        seneca.client({
            type: SENECA_PROTOCOL,
            host: 'auth',
            port: SERVICE_PORT,
            pin: 'role:auth',
        });
        seneca.client({
            type: SENECA_PROTOCOL,
            host: 'geo',
            port: SERVICE_PORT,
            pin: 'role:geo',
        });
        break;
    case 'geo':
        seneca.listen({
            type: SENECA_PROTOCOL,
            port: SERVICE_PORT,
            pin: 'role:geo',
        });
        break;
    default:
        throw new Error(`Unknown service '${serviceName}'.`);
    }

    // log env vars right await
    logger.debug('Environment variables:', process.env);
    // log when starting successfully
    seneca.ready(() => {
        logger.info(...logFormat('SERVICE', serviceName, 'ready'));
    });

    return seneca;
};
