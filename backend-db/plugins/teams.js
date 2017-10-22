'use strict';
const {E, LuciusError, Lucius} = require('module-lucius');
const db = require('../modules/db');
const logger = require('module-logger');
const {Team, Account} = require('../modules/db/types');

const PLUGIN_NAME = 'teams';

// TODO!!! Delete it from production
const predefinedTeams = () => {
  return [
      {
          id: 'team1',
          name: 'Test team 1',
          description: '',
      },
      {
          id: 'team2',
          name: 'Test team 2',
          description: 'Some description about this team.',
      },
      {
          id: 'team3',
          name: 'Test team 3',
          description: 'More text in description. Some description about this team. Some description about this team.',
      }
  ];
};

module.exports = function () {
    const lucius = new Lucius(this);

    lucius.pluginInit(PLUGIN_NAME, next => {
        db.ready().then(async () => {
            await db.seedTeams(predefinedTeams());
            next();
        }).catch(e => next(e));
    });

    lucius.register('role:db,cmd:getAllTeams', async function (connector, args) {
        return connector.input(args)
        .use(async function (responder) {
            const teams = await db.getAllAreas();
            return responder.success(teams);
        });
    });

    return PLUGIN_NAME;
};
