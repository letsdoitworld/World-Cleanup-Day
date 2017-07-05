'use strict';

const winston = require('winston');

winston.addColors({
    critical: 'magenta',
    error: 'red',
    warning: 'yellow',
    info: 'green',
    debug: 'cyan',
});

module.exports = new winston.Logger({
    transports: [
        new (winston.transports.Console)({
            colorize: true, level: 'debug',
        }),
    ],
    levels: {
        critical: 0, error: 1, warning: 2, info: 3, debug: 4,
    }
});
