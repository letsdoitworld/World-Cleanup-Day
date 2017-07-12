'use strict';
const winston = require('winston');

const LEVELS = [
    {name: 'critical', color: 'magenta'},
    {name: 'error', color: 'red'},
    {name: 'warning', color: 'yellow'},
    {name: 'info', color: 'green'},
    {name: 'debug', color: 'cyan'},
    {name: 'verbose', color: 'blue'},
];

winston.addColors(
    LEVELS.reduce((prev, level, index) => {
        prev[level.name] = level.color;
        return prev;
    }, {})
);

module.exports = new winston.Logger({
    transports: [
        new (winston.transports.Console)({
            colorize: true,
            level: process.env.LOG_LEVEL || 'debug',
            'timestamp': true,
        }),
    ],
    levels: LEVELS.reduce((prev, level, index) => {
        prev[level.name] = index;
        return prev;
    }, {}),
});
