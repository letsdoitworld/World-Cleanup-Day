'use strict';
const registry = require('./registry');
const {LuciusError} = require('./exception');

module.exports = {
    E: registry,
    LuciusError,
};
