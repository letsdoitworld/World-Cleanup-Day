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

const mapEvent = event => {
  event.peopleAmount = event.peoples ? event.peoples.length : 0;
  return event;
};

module.exports = function () {
  const lucius = new Lucius(this);

  lucius.pluginInit(PLUGIN_NAME, next => {
      db.ready().then(() => next()).catch(e => next(e))
  });
  lucius.register('role:db,cmd:createEvent', async function (connector, args, __) {
    return connector
      .input(args)
      .use(async function ({event}, responder) {
        const savedEvent = await db.createEvent(__.user.id, event);
        if (savedEvent.trashpoints) {
          const addedTrashpointsInfo = {};
          const addedTrashpointLocations = [];
          const addedTrashpointIds = {};
          const trashpointsIds = savedEvent.trashpoints;
          const origin = savedEvent.location;
          for (let trashpointId of trashpointsIds) {
            let trashpointInfo = await db.getTrashpoint(trashpointId);
            trashpointInfo.isIncluded = true;
            await db.modifyTrashpoint(trashpointId, __.user.id, trashpointInfo);
            trashpointInfo.id = trashpointId;
            addedTrashpointsInfo[trashpointId] = _.pick(trashpointInfo, ["id", "isIncluded", "status", "location", "name"]);
            addedTrashpointLocations.push(trashpointInfo.location);
            addedTrashpointIds[trashpointId] = trashpointInfo.location;
          }
          savedEvent.trashpoints = _.map(sortByDistance(origin, addedTrashpointLocations, opts),
            (location) => {
              const trpId = _.findKey(addedTrashpointIds, _.omit(location, ["distance"]));
              return addedTrashpointsInfo[trpId];
            }
          );
        }
        const mappedEvent = mapEvent(savedEvent);
        //TODO Status TRUE should be implemented all over the project. For now it's just mock data
        mappedEvent.status = true;
        return responder.success(mappedEvent);
    });
  });
  lucius.register('role:db,cmd:getUserOwnEvents', async function (connector, args, __) {
    return connector
      .input(args)
      .use(async function ({pageSize, pageNumber}, responder) {
        const events = await db.getUserOwnEvents(__.user.id, pageSize, pageNumber);
        const records = events.map(mapEvent).map((e) =>
          _.pick(e, ['id', 'name', 'address', 'location', 'description', 'startTime', 'endTime', 'email',
            'whatToBring', 'maxPeopleAmount', 'peopleAmount']));
        const total = await db.countUserEvents(__.user.id);
        return responder.success({ total, pageSize, pageNumber, records });
      })
  });
};