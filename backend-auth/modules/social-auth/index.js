'use strict';
const facebook = require('./facebook');
const google = require('./google');

const {LuciusError, E} = require('module-lucius');
const logger = require('module-logger');

module.exports = {
    getUserData: async function (authority, accessToken) {
        try {
            switch (authority) {
            case 'facebook':
                return await facebook.getUserData(accessToken);
            case 'google':
                return await google.getUserData(accessToken);
            default:
                throw new LuciusError(E.AUTH_UNKNOWN_REMOTE_AUTHORITY, authority);
            }
        } catch (e) {
            logger.fatal(e);
            throw new LuciusError(E.AUTH_REMOTE_ERROR, {message: e.message});
        }
    },
};
