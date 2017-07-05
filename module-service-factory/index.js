'use strict';
const Seneca = require('seneca');
const logger = require('module-logger');

module.exports = serviceName => {
    const timeout = parseInt(process.env.SENECA_TIMEOUT || 3);
    const log = process.env.SENECA_LOG_LEVEL || 'quiet';
    const seneca = Seneca({timeout, log});
    //FIXME: specific connections, depending on service name
    switch (serviceName) {
        case 'api':
            seneca.client({
                host: 'auth',
                pin: 'role:auth',
            });
        break;
        case 'auth':
            seneca.listen({
                pin: 'role:auth',
            });
        break;
    }
    seneca.ready(() => {
        logger.info(`Seneca service "${serviceName}" has started.`);
        logger.debug('Environment variables:', process.env);
    });
    return seneca;
};
