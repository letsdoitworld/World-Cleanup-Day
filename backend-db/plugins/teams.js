'use strict';
const {E, LuciusError, Lucius} = require('module-lucius');
const db = require('../modules/db');
const logger = require('module-logger');
const {Team, Account} = require('../modules/db/types');
const {list} = require('../teamList');
const _ = require('lodash');

const PLUGIN_NAME = 'teams';

const additionalTeamInfo = async (team, amount) => {
  team.members = await db.countAccountsForTeam(team.id);
  team.trashpoints = await db.countTeamTrashpoints(team.id);
  const trashpoints = await db.getTeamTrashpoints(team.id, amount)
  team.lastTrashpoints = trashpoints[0];
  team.groupCount = trashpoints[1];
  return team
}

module.exports = function () {
    const lucius = new Lucius(this);

    lucius.pluginInit(PLUGIN_NAME, next => {
        db.ready()
            .then(() => db.seedTeams(list))
            .then(() => next())
            .catch(e => next(e));
    });

    lucius.register('role:db,cmd:getAllTeams', async function (connector, args) {
        return connector.input(args)
            .use(async function ({CC, search}, responder) {
                const teams = await db.getAllTeamsByCountry(CC, search);
                const AMOOUNT_OF_TEAMS = 4;
                const teamsWithMembers = await Promise.all(teams.map(async team => additionalTeamInfo(team, AMOOUNT_OF_TEAMS)));
                return responder.success(teamsWithMembers);
            });
    });

    lucius.register('role:db,cmd:getAllTeamsWeb', async function (connector, args) {
        return connector.input(args)
            .use(async function ({CC, superadmin}, responder) {
                const teams = await db.getAllTeams();
                const filteredTeams = superadmin ? teams : teams.filter(team => team.CC === CC);
                return responder.success(sortedTeams);
            });
    });

    lucius.register('role:db,cmd:getCountTeamsTrashpoints', async function (connector, args) {
        return connector.input(args)
            .use(async function ({}, responder) {
                let teams = await db.getAllTeams();
                let i, len;
                for (i = 0, len = teams.length; i < len; i++) {
                    teams[i]['trashpoints'] = await db.countTeamTrashpoints(teams[i].id);
                    teams[i]['users'] = await db.countAccountsForTeam(teams[i].id);
                }

                return responder.success(teams);
            });
    });

    lucius.register('role:db,cmd:getTeam', async function (connector, args, __) {
        return connector.input(args)
            .use(async function ({id}, responder) {
                const team = await db.getTeam(id);
                if (!team) {
                    return responder.failure(new LuciusError(E.TEAM_NOT_FOUND, {id: id}));
                }
                const fullInfoTeam = await additionalTeamInfo(team, -1);
                return responder.success(fullInfoTeam);
            });
    });

    return PLUGIN_NAME;
};
