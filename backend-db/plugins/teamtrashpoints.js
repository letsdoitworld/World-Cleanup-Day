'use strict';
const {E, LuciusError, Lucius} = require('module-lucius');
const db = require('../modules/db');
const logger = require('module-logger');
const {Team, Account} = require('../modules/db/types');

const PLUGIN_NAME = 'teamtrashpoints';

module.exports = function () {
    const lucius = new Lucius(this);

    lucius.pluginInit(PLUGIN_NAME, next => {
        db.ready().then(() => next()).catch(e => next(e));
    });

    lucius.register('role:db,cmd:getAllTeamTrashpoints', async function (connector, args) {
        return connector.input(args)
            .use(async function ({}, responder) {
                let teamTrashpoints = await db.getAllTeamTrashpoints();
                return responder.success(teamTrashpoints);
            });
    });

    lucius.register('role:db,cmd:getTeamTrashpoint', async function (connector, args, __) {
        return connector.input(args)
            .use(async function ({id}, responder) {
                let teamTrashpoint = await db.getTeamTrashpoint(id);
                if (!teamTrashpoint) {
                    return responder.failure(new LuciusError(E.TEAM_TRASHPOINT_NOT_FOUND, {id: id}));
                }

                return responder.success(teamTrashpoint);
            });
    });

    return PLUGIN_NAME;
};
