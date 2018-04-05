'use strict';
const {E, LuciusError, Lucius} = require('module-lucius');
const db = require('../modules/db');
const logger = require('module-logger');
const {Team, Account} = require('../modules/db/types');
const {list} = require('../teamList');
const COUNTRY_LIST = require('./countries')
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
                const teams = await db.getAllTeams();
                const filteredTeams = search ? teams.filter(team =>
                    team.name && team.name.toUpperCase().indexOf(search.toUpperCase()) > -1 ||
                    team.teamDescription && team.teamDescription.toUpperCase().indexOf(search.toUpperCase()) > -1 ||
                    COUNTRY_LIST[team.CC] && COUNTRY_LIST[team.CC].toUpperCase().indexOf(search.toUpperCase()) > -1
                ) : teams;
                const sortedTeams = _.sortBy(filteredTeams, 'name');
                const sortedTeamsByCountry = _.sortBy(sortedTeams, team => team.CC !== CC);
                const teamsWithMembers = await Promise.all(sortedTeamsByCountry.map(async team => additionalTeamInfo(team, 4)));
                return responder.success(teamsWithMembers);
            });
    });

    lucius.register('role:db,cmd:getAllTeamsWeb', async function (connector, args) {
        return connector.input(args)
            .use(async function ({CC, superadmin}, responder) {
                const teams = await db.getAllTeams();
                const filteredTeams = superadmin ? teams : teams.filter(team => team.CC === CC);
                const sortedTeams = _.sortBy(filteredTeams, 'name');
                return responder.success(sortedTeams);
            });
    });

    lucius.register('role:db,cmd:getCountTeamsTrashpoints', async function (connector, args) {
        return connector.input(args)
            .use(async function ({}, responder) {
                let teams = await db.getAllTeams();
                teams.sort((a, b) => {
                    const nameA = a.name.toUpperCase();
                    const nameB = b.name.toUpperCase();
                    return (nameA > nameB) ? 1 : (nameA < nameB ? -1 : 0)
                });
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
