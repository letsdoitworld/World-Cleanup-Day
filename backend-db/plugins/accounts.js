'use strict';
const {E, LuciusError, Lucius} = require('module-lucius');
const util = require('module-util');
const db = require('../modules/db');
const {Account} = require('../modules/db/types');

const PLUGIN_NAME = 'accounts';

const filterBriefAccountData = account => util.object.filter(account, {
    id: true,
    name: true,
    email: true,
    role: true,
    locked: true,
    country: true,
    pictureURL: true,
    termsAcceptedAt: true,
});

module.exports = function () {
    const lucius = new Lucius(this);

    lucius.pluginInit(PLUGIN_NAME, next => {
        db.ready().then(() => next()).catch(e => next(e));
    });

    lucius.register('role:db,cmd:lockAccount', async function (connector, args, __) {
        return connector.input(args)
        .use(async function ({accountId, locked}, responder) {
            if (accountId === __.user.id) {
                return responder.failure(new LuciusError(E.ACCOUNT_CANNOT_SELF_LOCK));
            }
            const ret = await db.setAccountLock(accountId, locked, __.user.id);
            if (!ret) {
                return responder.failure(new LuciusError(
                    E.ACCOUNT_NOT_FOUND, {id: accountId}))
            }
            return responder.success();
        })
    });

    lucius.register('role:db,cmd:endSession', async function (connector, args, __) {
        return connector.input(args)
        .use(async function ({sessionId}, responder) {
            const ret = await db.removeSession(sessionId);
            if (!ret) {
                return responder.failure(new LuciusError(
                    E.SESSION_NOT_FOUND, {id: sessionId}))
            }
            return responder.success();
        })
    });

    lucius.register('role:db,cmd:acceptTerms', async function (connector, args, __) {
        return connector
        .use(async function (foo, responder) {
            const accountId = __.user.id;
            const ret = await db.updateAccountTerms(accountId);
            if (!ret) {
                return responder.failure(new LuciusError(
                    E.ACCOUNT_NOT_FOUND, {id: accountId}))
            }
            return responder.success();
        })
    });

    lucius.register('role:db,cmd:getAccounts', async function (connector, args) {
        return connector.input(args)
        .use(async function ({pageSize, pageNumber}, responder) {
            const accounts = await db.getAccounts(pageSize, pageNumber);
            return responder.success({
                total: await db.countAccounts(),
                pageSize,
                pageNumber,
                records: accounts.map(a => filterBriefAccountData(a)),
            });
        })
    });

    lucius.register('role:db,cmd:modifyOwnUserProfile', async function (connector, args, __) {
        return connector.input(args)
        .use(async function ({update}, responder) {
            const id = __.user.id;
            const account = await db.modifyAccount(id, id, update);
            if (!account) {
                return responder.failure(new LuciusError(E.ACCOUNT_NOT_FOUND, {id}))
            }
            return responder.success(filterBriefAccountData(account));
        })
    });

    lucius.register('role:db,cmd:getOrCreateAccountFromSocial', async function (connector, args, __) {
        return connector.input(args)
        .use(async function (socialAccount, responder) {
            const accountId = Account.makeAccountIdFromSocial(
                socialAccount.source,
                socialAccount.id
            );
            let account = await db.getAccount(accountId);
            if (!account) {
                account = await db.createAccount(
                    accountId,
                    socialAccount.name,
                    socialAccount.email,
                    Account.ROLE_VOLUNTEER,
                    socialAccount.pictureURL
                );
            }
            return responder.success(account);
        });
    });

    lucius.register('role:db,cmd:getOrCreateSession', async function (connector, args, __) {
        return connector.input(args)
        .use(async function ({accountId}, responder) {
            const session = await db.createOrTouchSession(
                accountId,
                util.time.getExpirationIntervalInDays(),
            );
            return responder.success({id: session.id});
        });
    });

    lucius.register('role:db,cmd:getAccountById', async function (connector, args, __) {
        return connector.input(args)
        .use(async function ({accountId, filterFields}, responder) {
            let account = await db.getAccount(accountId);
            if (!account) {
                return responder.failure(new LuciusError(
                    E.ACCOUNT_NOT_FOUND, {id: accountId}))
            }
            if (filterFields) {
                account = filterBriefAccountData(account);
            }
            if (account.role === Account.ROLE_LEADER) {
                account.areas = (await db.getAreasForLeader(account.id)).map(area => area.id);
            } else {
                account.areas = [];
            }
            return responder.success(account);
        });
    });

    lucius.register('role:db,cmd:getAccountBySessionId', async function (connector, args, __) {
        return connector.input(args)
        .use(async function ({sessionId}, responder) {
            // check that the session exists;
            // we re-extend the expiration time in the process
            const session = await db.verifyAndTouchSession(
                sessionId, util.time.getExpirationIntervalInDays()
            );
            if (!session) {
                return responder.failure(new LuciusError(
                    E.SESSION_NOT_FOUND, {id: sessionId}))
            }
            // get the account info
            const account = await db.getAccount(session.accountId);
            if (!account) {
                return responder.failure(new LuciusError(
                    E.ACCOUNT_NOT_FOUND, {id: session.accountId}))
            }
            return responder.success(filterBriefAccountData(account));
        });
    });

    return PLUGIN_NAME;
};
