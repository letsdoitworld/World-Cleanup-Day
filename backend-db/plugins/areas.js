'use strict';
const {E, LuciusError, Lucius} = require('module-lucius');
const db = require('../modules/db');
const util = require('module-util');
const logger = require('module-logger');
const {Account} = require('../modules/db/types');

const AREA_RETRY_INTERVAL = 1000;
const PLUGIN_NAME = 'areas';

const retryUntilGetAreas = async lucius => {
    try {
        return await lucius.request('role:geo,cmd:getAllAreas');
    } catch (e) {
        logger.debug('Still waiting for geo service:', e.message);
        setTimeout(() => retryUntilGetAreas(lucius), AREA_RETRY_INTERVAL);
    }
};

const sortAreasByName = async (areas) => {
    return areas.sort((a, b) => {
        let keyA = a.name,
            keyB = b.name;
        // Compare the 2 dates
        if(keyA < keyB) return -1;
        if(keyA > keyB) return 1;
        return 0;
    });
};


module.exports = function () {
    const lucius = new Lucius(this);

    lucius.pluginInit(PLUGIN_NAME, next => {
        db.ready().then(async () => {
            const ret = await retryUntilGetAreas(lucius);
            if (ret.isSuccessful()) {
                await db.seedAreas(ret.getPayload());
            }
            else {
                logger.error('Had problems fetching areas, db has NOT been updated with latest area data:', ret.getErrors());
            }
            next();
        }).catch(e => next(e));
    });

    lucius.register('role:db,cmd:getAllAreas', async function (connector, args) {
        return connector.input(args)
        .use(async function ({parentId}, responder) {
            const areas = typeof parentId === 'undefined'
                ? await db.getAllAreas()
                : await db.getAreasByParent(parentId);
            const sortAreas = await sortAreasByName(areas);
            const filtered = sortAreas.map(value => util.object.filter(
                value,
                {id: true, name: true, parentId: true}
            ));
            return responder.success(filtered);
        });
    });

    lucius.register('role:db,cmd:getMyAreas', async function (connector, args, __) {
        return connector
        .use(async function (foo, responder) {
            const areas = await db.getAreasForLeader(__.user.id);
            const sortAreas = await sortAreasByName(areas);
            return responder.success(sortAreas);
        });
    });

    lucius.register('role:db,cmd:getUserAreas', async function (connector, args) {
        return connector.input(args)
        .request('role:db,cmd:getAccountById', ({accountId}) => ({accountId}))
        .use(async function ({id}, responder) {
            const areas = await db.getAreasForLeader(id);
            const sortAreas = await sortAreasByName(areas);
            return responder.success(sortAreas);
        });
    });

    lucius.register('role:db,cmd:assignAreaLeader', async function (connector, args, __) {
        return connector
        // attempt to fetch indicated user
        .input(args)
        .set('args')
        .request('role:db,cmd:getAccountById', ({accountId}) => ({accountId}))
        .set('account')
        // process assignment
        .get(['args', 'account'])
        .use(async function ({args, account}, responder) {
            const {areaId, accountId} = args;
            // check that indicated user has correct role
            if (account.role !== Account.ROLE_VOLUNTEER
                && account.role !== Account.ROLE_LEADER
            ) {
                return responder.failure(new LuciusError(
                    E.ACCOUNT_ROLE_UNFIT_FOR_LEADER, {id: account.id, role: account.role}))
            }
            // attempt to fetch area
            const rawAreaDoc = await db.getRawAreaDoc(areaId);
            if (!rawAreaDoc) {
                return responder.failure(new LuciusError(E.AREA_NOT_FOUND, {id: areaId}))
            }
            //check if user is blocked
            if (account.locked) {
                return responder.failure(new LuciusError(E.ACCOUNT_IS_LOCK, {id: accountId}));
            }
            // set the leader on the area
            let areaLeadersId = [];

            if (rawAreaDoc.leaderId) {
                areaLeadersId = typeof rawAreaDoc.leaderId === "object" ?
                    rawAreaDoc.leaderId :
                    rawAreaDoc.leaderId.split();
            }

            if (areaLeadersId.indexOf(accountId) !== -1) {
                return responder.failure(new LuciusError(E.AREA_LEADER_EXISTS, {id: accountId}));
            }
            areaLeadersId.push(accountId);
            const ret = await db.modifyArea(areaId, __.user.id, {leaderId: areaLeadersId}, rawAreaDoc);
            if (!ret) {
                return responder.failure(new LuciusError(E.AREA_NOT_FOUND, {id: areaId}))
            }
            // if user not already leader, make them leader
            if (account.role !== Account.ROLE_LEADER) {
                const ret = await db.modifyAccount(
                    account.id, __.user.id, {role: Account.ROLE_LEADER}
                );
                if (!ret) {
                    return responder.failure(new LuciusError(E.ACCOUNT_NOT_FOUND, {id: account.id}))
                }
            }
            return responder.success();
        })
    });

    lucius.register('role:db,cmd:removeAreaLeader', async function (connector, args, __) {
        return connector.input(args)
        .use(async function ({areaId, accountId}, responder) {
            // attempt to fetch area
            const rawAreaDoc = await db.getRawAreaDoc(areaId);
            if (!rawAreaDoc) {
                return responder.failure(new LuciusError(E.AREA_NOT_FOUND, {id: areaId}))
            }
            // check leaders of area
            if (rawAreaDoc.leaderId) {
                let leadersId = typeof rawAreaDoc.leaderId === "object" ?
                    rawAreaDoc.leaderId :
                    rawAreaDoc.leaderId.split();

                const indexLeader = leadersId.indexOf(accountId);
                if (indexLeader === -1) {
                    return responder.failure(new LuciusError(E.LEADER_NOT_FOUND, {id: accountId}))
                }
                // remove the leader
                leadersId.splice(indexLeader, 1);
                const ret = await db.modifyArea(areaId, __.user.id, {leaderId: leadersId}, rawAreaDoc);
                if (!ret) {
                    return responder.failure(new LuciusError(E.AREA_NOT_FOUND, {id: areaId}))
                }
                // see if user is still assigned to any areas
                const cnt = await db.getAreasForLeader(accountId);
                if (cnt.length === 0) {
                    // if not a leader anywhere, set user role to volunteer
                    const ret = await db.modifyAccount(
                        accountId, __.user.id, {role: Account.ROLE_VOLUNTEER}
                    );
                    if (!ret) {
                        return responder.failure(new LuciusError(E.ACCOUNT_NOT_FOUND, {id: accountId}))
                    }
                }
            }
            return responder.success();
        })
    });

    lucius.register('role:db,cmd:getAreaLeaders', async function (connector, args) {
        return connector
            .input(args)
            .use(async function ({areaId}, responder) {
                const rawAreaDoc = await db.getRawAreaDoc(areaId);
                if (!rawAreaDoc) {
                    return responder.failure(new LuciusError(E.AREA_NOT_FOUND, {id: areaId}))
                }
                //get leaders id of area
                const leadersId = await db.getArea(areaId);
                if (!leadersId.leaderId){
                    return responder.success([]);
                }
                let leaders = typeof leadersId.leaderId === "object" ?
                    leadersId.leaderId :
                    leadersId.leaderId.split();

                //get leader info
                let leadersInfo = [];
                for (let i = 0; i < leaders.length; i ++){
                    let user = await db.getAccount(leaders[i]);
                    if(user) {
                        let userInfo = {};
                        userInfo.name = user.name;
                        userInfo.email = user.email || '';
                        userInfo.pictureURL = user.pictureURL || '';
                        leadersInfo.push(userInfo);
                    }
                }
                return responder.success(leadersInfo);
            })
    });
    return PLUGIN_NAME;
};
