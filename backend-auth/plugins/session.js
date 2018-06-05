'use strict';
const {E, LuciusError, Lucius} = require('module-lucius');
const jwt = require('../modules/crypto/jwt');
const socialAuth = require('../modules/social-auth');

const PLUGIN_NAME = 'session';

const verifyAccount = async function ({account}, responder) {
    if (account.locked) {
        return responder.failure(new LuciusError(E.AUTH_ACCOUNT_IS_LOCKED));
    }
    return responder.success();
};

module.exports = function () {
    const lucius = new Lucius(this);

    lucius.pluginInit(PLUGIN_NAME);

    lucius.register('role:auth,cmd:logout', async function (connector, args, __) {
        return connector
        .request('role:db,cmd:endSession', {sessionId: __.session.id})
    });

    lucius.register('role:auth,cmd:socialLogin', async function (connector, args) {
        return connector.input(args)
        // run source + social token against a social service
        .use(async function (params, responder) {
            const userData = await socialAuth.getUserData(params.source, params.token);
            userData.source = params.source;
            return responder.success(userData);
        })
        // run social data through account upsert
        .request('role:db,cmd:getOrCreateAccountFromSocial')
        .set('account')
        // verify account properties
        .get('account')
        .use(verifyAccount)
        // run account id against session
        .get('account')
        .input(({account}) => ({accountId: account.id}))
        .request('role:db,cmd:getOrCreateSession')
        .set('session')
        // run session id through JWT and return JWT
        .get(['account', 'session'])
        .use(async function ({account, session}, responder) {
            const tokenPayload = {sessionId: session.id};
            const token = jwt.create(tokenPayload);
            if (token) {
                return responder.success({token, resourceId: account.id});
            }
            return responder.failure(new LuciusError(E.AUTH_CANNOT_GENERATE_TOKEN));
        });
    });

    lucius.register('role:auth,cmd:verifyToken', async function (connector, args) {
        // decode the JWT token and pass the payload on
        return connector.input(args)
        .use(async function (params, responder) {
            const tokenPayload = jwt.verify(params.token);
            if (tokenPayload) {
                return responder.success(tokenPayload);
            }
            return responder.failure(new LuciusError(E.AUTH_INVALID_TOKEN));
        })
        .set('tokenPayload')
        // verify that session is still active and get the user's info
        .input(({sessionId}) => ({sessionId}))
        .request('role:db,cmd:getAccountBySessionId')
        .set('account')
        // verify account properties
        .get('account')
        .use(verifyAccount)
        // compose response
        .get(['account', 'tokenPayload'])
        .use(async function ({account, tokenPayload}, responder) {
            return responder.success({
                account,
                session: {
                    id: tokenPayload.sessionId,
                },
            });
        })
    });

    return PLUGIN_NAME;
};
