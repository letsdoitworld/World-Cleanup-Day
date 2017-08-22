'use strict';
const {E, LuciusError, isLuciusError, LUCIUS_ERROR_MARKER} = require('./error');
const Lucius = require('./modules/lucius');

module.exports = {
    E,
    LuciusError,
    Lucius,
    isLuciusError,
    LUCIUS_ERROR_MARKER,
};
