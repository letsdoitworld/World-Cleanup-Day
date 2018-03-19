'use strict';
const { E, LuciusError, Lucius } = require('module-lucius');
const util = require('module-util');
const db = require('../modules/db');
const { Dataset, Account, Image } = require('../modules/db/types');
const sortByDistance = require('sort-by-distance');
const _ = require("lodash");
const opts = {
    yName: 'latitude',
    xName: 'longitude'
};

const PLUGIN_NAME = 'events';

module.exports = function () {
  const lucius = new Lucius(this);

  lucius.pluginInit(PLUGIN_NAME, next => {
      db.ready().then(() => next()).catch(e => next(e))
  });
  lucius.register('role:db,cmd:createEvent', async function (connector, args, __) {
    return connector
      .input(args)
      .use(async function ({event}, responder) {
        const eventInfo = await db.createEvent(__.user.id, event);
        if (eventInfo.trashpoints) {
          const addedTrashpointsInfo = {};
          const addedTrashpointLocations = [];
          const addedTrashpointIds = {};
          const trashpointsIds = eventInfo.trashpoints;
          const origin = eventInfo.location;
          for (let trashpointId of trashpointsIds) {
              let trashpointInfo = await db.getTrashpoint(trashpointId);
              trashpointInfo.isIncluded = true;
              await db.modifyTrashpoint(trashpointId, __.user.id, trashpointInfo);
              trashpointInfo.id = trashpointId;
              addedTrashpointsInfo[trashpointId] = _.pick(trashpointInfo,
                  ["id", "isIncluded", "status", "location", "name"]);
              addedTrashpointLocations.push(trashpointInfo.location);
              addedTrashpointIds[trashpointId] = trashpointInfo.location;
          }
          eventInfo.trashpoints = _.map(sortByDistance(origin, addedTrashpointLocations, opts),
              (location) => {
                  const trpId = _.findKey(addedTrashpointIds, _.omit(location, ["distance"]));
                  return addedTrashpointsInfo[trpId];
              });
        }
        //TODO Status TRUE should be implemented all over the project. For now it's just mock data
        eventInfo.status = true;
        return responder.success(eventInfo);
    });
  });
  lucius.register('role:db,cmd:getUserOwnEvents', async function (connector, args, __) {
    return connector
      .input(args)
      .use(async function ({pageSize, pageNumber}, responder) {
        const records = await db.getUserOwnEvents(__.user.id, pageSize, pageNumber);
        const total = await db.countUserEvents(__.user.id);
        return responder.success({
          total,
          pageSize,
          pageNumber,
          records
        });
      })
  });
};