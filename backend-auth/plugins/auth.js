'use strict';
const {E, LuciusError, Lucius} = require('module-lucius');
const logger = require('module-logger');
const jwt = require('../modules/crypto/jwt');
const remoteAuthority = require('../modules/remote-authority');

const PLUGIN_NAME = 'auth';
const DEFAULT_OPTIONS = {};

module.exports = function (options) {
    const seneca = this;
    options = seneca.util.deepextend(DEFAULT_OPTIONS, options);
    const lucius = new Lucius(seneca);
    lucius.pluginInit(PLUGIN_NAME);

    lucius.add('role:auth,cmd:verifyToken', async function (args, responder) {
        try {
            const TOKEN = args.token;
            if (jwt.verify(TOKEN)) {
                return responder.success();
            } else {
                return responder.failure(new LuciusError(E.AUTH_INVALID_TOKEN));
            }
        } catch (e) {
            return responder.fatal(e);
        }
    });

    lucius.add('role:auth,cmd:externalUserInfo', async function (args, responder) {
        try {
            const AUTHORITY = args.source;
            const AUTHORITY_TOKEN = args.token;
            const userInfo = await remoteAuthority.getUserData(AUTHORITY, AUTHORITY_TOKEN);
            return responder.success(userInfo);
        } catch (e) {
            return responder.fatal(e);
        }
    });

    lucius.add('role:auth,cmd:externalLogin', async function (args, responder) {
        try {
            const AUTHORITY = args.source;
            const AUTHORITY_TOKEN = args.token;
            const requestUserInfo = await lucius.act('role:auth,cmd:externalUserInfo',
                {source: AUTHORITY, token: AUTHORITY_TOKEN});
            if (!requestUserInfo.isSuccessful()) {
                return responder.same(requestUserInfo);
            }
            const localToken = jwt.create(requestUserInfo.getPayload());
            return responder.success({token: localToken});
        } catch (e) {
            return responder.fatal(e);
        }
    });

    return PLUGIN_NAME;
};
