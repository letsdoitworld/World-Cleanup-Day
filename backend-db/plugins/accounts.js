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
    team: true,
    teamInfo: true,
    public: true
});

const countriesForLeader = areasForLeader => {
    const leaderAreaHash = areasForLeader
        // only need the country code
        .map(area => area.id)
        // extract the top level country codes for all areas
        // eg. [US.CA.SF, RO.AB, RO.BC] will become {US:true, RO:true}
        .reduce((topAreaHash, areaCode) => {
            topAreaHash[areaCode.split('.').shift()] = true;
            return topAreaHash;
        }, {})
    ;
    return Object.getOwnPropertyNames(leaderAreaHash);
};

module.exports = function () {
    const lucius = new Lucius(this);

    lucius.pluginInit(PLUGIN_NAME, next => {
        db.ready().then(() => next()).catch(e => next(e));
    });

    lucius.register('role:db,cmd:lockAccount', async function (connector, args, __) {
        return connector.input(args)
        .use(async function ({accountId, locked}, responder) {
            // basic sanity checks
            if (accountId === __.user.id) {
                return responder.failure(new LuciusError(E.ACCOUNT_CANNOT_SELF_LOCK));
            }
            const rawAccount = await db.getRawAccountDoc(accountId);
            if (!rawAccount) {
                return responder.failure(new LuciusError(E.ACCOUNT_NOT_FOUND, {id: accountId}));
            }
            if (__.user.role === Account.ROLE_LEADER) {
                // superadmins can only be [un]locked by other superadmins
                if (rawAccount.role === Account.ROLE_SUPERADMIN) {
                    return responder.failure(new LuciusError(E.ACCESS_DENIED));
                }
                // leaders may only access users whose country falls in one of their areas
                if (!rawAccount.country) {
                    return responder.failure(new LuciusError(E.ACCOUNT_NOT_SUBJECT_TO_LEADER, {accountId, leaderId: __.user.id}));
                }
                const leaderCountries = countriesForLeader(await db.getAreasForLeader(__.user.id));
                if (leaderCountries.indexOf(rawAccount.country) === -1) {
                    return responder.failure(new LuciusError(E.ACCOUNT_NOT_SUBJECT_TO_LEADER, {accountId, leaderId: __.user.id}));
                }
            }
            // perform [un]lock
            const ret = await db.setAccountLock(accountId, locked, __.user.id, rawAccount);
            if (!ret) {
                return responder.failure(new LuciusError(
                    E.ACCOUNT_NOT_FOUND, {id: accountId}))
            }
            //delete all user's upcoming events if locked is true and delete from area leader
            if (locked) {
                //delete user from area leader
                const areaUserLeader = await db.getAreasForLeader(__.user.id);
                for (let i = 0; i < areaUserLeader.length; i++) {
                    let indexLeader = areaUserLeader[i].leaderId.indexOf(accountId);
                    areaUserLeader[i].leaderId.splice(indexLeader, 1);
                    await db.modifyArea(areaUserLeader[i].id, __.user.id, {leaderId: areaUserLeader[i].leaderId});
                }

                //delete upcoming events
                const events = await db.getUserOwnEvents(args.accountId, 0 , 0);
                let eventsId = [];
                events.filter(t => {
                    if (t.startTime > util.time.getNowUTC())
                    eventsId.push(t.id);
                });
                for (let i = 0; i < eventsId.length; i++) {
                    await lucius.request('role:db,cmd:deleteEventById', {id: eventsId[i], __: __});
                }
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

    lucius.register('role:db,cmd:getAccounts', async function (connector, args, __) {
        return connector.input(args)
        .use(async function ({pageSize, pageNumber, country, nameSearch, userRole}, responder) {
            if (nameSearch) {
                nameSearch = nameSearch.toLowerCase();
            }
            let accounts;
            let total;
            if (__.user.role === Account.ROLE_SUPERADMIN) {
                if (nameSearch) {
                    accounts = await db.getAccountsByNameSearch(nameSearch, pageSize, pageNumber, country);
                    total = await db.countAccountsForNameSearch(nameSearch, country);
                }
                else if (country) {
                    accounts = await db.getAccountsByCountry(country, pageSize, pageNumber, userRole);
                    total = await db.countAccountsForCountry(country);
                }
                else {
                    accounts = await db.getAccounts(pageSize, pageNumber, userRole);
                    total = await db.countAccounts();
                }
            }
            else {
                if (!country) {
                    return responder.failure(new LuciusError(E.COUNTRY_REQUIRED));
                }
                const leaderCountries = countriesForLeader(await db.getAreasForLeader(__.user.id));
                if (leaderCountries.indexOf(country) === -1) {
                    return responder.failure(new LuciusError(E.ACCESS_DENIED));
                }
                if (nameSearch) {
                    accounts = await db.getAccountsByNameSearch(nameSearch, pageSize, pageNumber, country);
                    total = await db.countAccountsForNameSearch(nameSearch, country);
                }
                else {
                    accounts = await db.getAccountsByCountry(country, pageSize, pageNumber, userRole);
                    total = await db.countAccountsForCountry(country);
                }
            }
            return responder.success({
                total,
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
            if (account.team) {
                account.teamInfo = await db.getTeam(account.team)
                account.teamInfo.members = await db.countAccountsForTeam(account.team)
                account.teamInfo.trashpoints = await db.countTeamTrashpoints(account.team)
                const trashpoints = await db.getTeamTrashpoints(account.team, 4)
                account.teamInfo.lastTrashpoints = trashpoints[0];
                account.teamInfo.groupCount = trashpoints[1];
            }
            return responder.success(filterBriefAccountData(account));
        })
    });

    lucius.register('role:db,cmd:modifyOwnProfilePrivacy', async function (connector, args, __) {
        return connector.input(args)
        .use(async function ({update}, responder) {
            const id = __.user.id;
            if (!update.value) {
                const userEventsCount = await db.countUserEvents(id);
                if (userEventsCount > 0) {
                    return responder.failure(new LuciusError(E.ACCOUNT_HAS_ACTIVE_EVENTS, {id}))
                }
            }
            const account = await db.modifyOwnAccountPrivacy(id, id, update.value);
            if (!account) {
                return responder.failure(new LuciusError(E.ACCOUNT_NOT_FOUND, {id}))
            }
            return responder.success({ success: true });
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
            if (account.locked) {
                return responder.failure(new LuciusError(E.ACCOUNT_BLOCKED, {accountId}));
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
            // see if target account exists
            let account = await db.getAccount(accountId);
            if (!account) {
                return responder.failure(new LuciusError(E.ACCOUNT_NOT_FOUND, {id: accountId}));
            }
            // users can always see their own account info
            if (__.user.id !== account.id
                // superadmins can see any user's account info
                && __.user.role !== Account.ROLE_SUPERADMIN
            ) {
                // leaders may only access users whose country falls in one of their areas
                if (__.user.role === Account.ROLE_LEADER) {
                    if (!account.country) {
                        return responder.failure(new LuciusError(E.ACCOUNT_NOT_SUBJECT_TO_LEADER, {accountId, leaderId: __.user.id}));
                    }
                    const leaderCountries = countriesForLeader(await db.getAreasForLeader(__.user.id));
                    if (leaderCountries.indexOf(account.country) === -1) {
                        return responder.failure(new LuciusError(E.ACCOUNT_NOT_SUBJECT_TO_LEADER, {accountId, leaderId: __.user.id}));
                    }
                }
                else {
                    // fallback to deny in all other cases
                    return responder.failure(new LuciusError(E.ACCESS_DENIED));
                }
            }
            // prepare account data
            if (filterFields) {
                account = filterBriefAccountData(account);
            }
            if (account.role === Account.ROLE_LEADER) {
                account.areas = (await db.getAreasForLeader(account.id)).map(area => area.id);
            } else {
                account.areas = [];
            }
            if (account.team) {
                const teamInfo = await db.getTeam(account.team);
                if (teamInfo) {
                    account.teamInfo = teamInfo;
                    account.teamInfo.members = await db.countAccountsForTeam(account.team);
                    account.teamInfo.trashpoints = await db.countTeamTrashpoints(account.team);
                    const trashpoints = await db.getTeamTrashpoints(account.team, 4);
                    account.teamInfo.lastTrashpoints = trashpoints[0];
                    account.teamInfo.groupCount = trashpoints[1];
                }
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
