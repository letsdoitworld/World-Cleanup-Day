'use strict';
const winston = require('winston');

const LOG_LEVEL = process.env.LOG_LEVEL;

const LEVELS = [
    {name: 'fatal', color: 'magenta'},
    {name: 'error', color: 'red'},
    {name: 'warning', color: 'yellow'},
    {name: 'info', color: 'green'},
    {name: 'debug', color: 'cyan'},
    {name: 'verbose', color: 'blue'},
];

winston.addColors(
    LEVELS.reduce((prev, level) => {
        prev[level.name] = level.color;
        return prev;
    }, {})
);

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            colorize: true,
            level: LOG_LEVEL || 'debug',
            'timestamp': true,
        }),
    ],
    levels: LEVELS.reduce((prev, level, index) => {
        prev[level.name] = index;
        return prev;
    }, {}),
});

logger.formatter = (prefix) =>
    (action, pattern, args, ...extra) => {
        let log = `${prefix}: [${action}] ${pattern}`;
        if (typeof args !== 'undefined') {
            log += ' ' + (typeof args === 'string' ? args : JSON.stringify(args));
        }
        log += extra.length ? ' //' : '';
        if (extra.length) {
            return [log, ...extra];
        }
        return [log];
    };

// XXX: Fix error stack printing. Some Error objects are missing the error message
// from the serialized trace, and none of them include the code property in it.
// We replace each logger method with a function that intercepts Error instances
// and reformats the first line of their trace to include name, code and message.
LEVELS.forEach(({name}) => {
    const original = logger[name];
    logger[name] = (...params) => {
        for (let i = 0; i < params.length; i++) {
            if (params[i] instanceof Error && params[i].stack) {
                const e = params[i];
                const lines = e.stack.split('\n');
                lines.shift();
                lines.unshift(`${e.name}:` + (e.code ? ` [${e.code}]` : '') + ` ${e.message}`);
                params[i] = lines.join('\n');
            }
            else if (typeof params[i] === 'string' && params[i].length > 1000) {
                params[i] = params[i].substring(0, 1000) + '[MORE]';
            }
            else if (Array.isArray(params[i]) && params[i].length > 20) {
                params[i] = params[i].slice(0, 20);
                params[i].push('[MORE]');
            }
        }
        return original(...params);
    };
});

module.exports = logger;
