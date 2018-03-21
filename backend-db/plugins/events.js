'use strict';
const {E, LuciusError, Lucius} = require('module-lucius');
const util = require('module-util');
const db = require('../modules/db');
const {Dataset, Account, Image} = require('../modules/db/types');
const sortByDistance = require('sort-by-distance');
const _ = require("lodash");
const opts = {
    yName: 'latitude',
    xName: 'longitude'
};

const PLUGIN_NAME = 'events';

const filterFieldsEvents = event => _.pick(event, ['id', 'name', 'address', 'location', 'description', 'startTime',
  'endTime', 'email', 'phonenumber', 'whatToBring', 'maxPeopleAmount', 'peopleAmount']);

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
    lucius.register('role:db,cmd:getEvents', async function (connector, args) {
      return connector
        .input(args)
        .use(async function ({pageSize, pageNumber, location, radius}, responder) {
          let minLocation, maxLocation;
          if (location) {
            try {
              location = JSON.parse(location);
            } catch (e) {
              return responder.failure(new LuciusError(E.INVALID_TYPE, {parameter: 'location'}));
            }

            if (location.latitude && location.longitude) {
              if (radius > 0) {
                const minLatitude = location.latitude - radius / 111.12;
                const minLongitude = location.longitude - radius / (111.320 * (Math.cos(location.latitude / 180.0 * Math.PI)));
                const maxLatitude = location.latitude + radius / 111.12;
                const maxLongitude = location.longitude + radius / (111.320 * (Math.cos(location.latitude / 180.0 * Math.PI)));
                minLocation = {latitude: minLatitude, longitude: minLongitude};
                maxLocation = {latitude: maxLatitude, longitude: maxLongitude};
              } else {
                minLocation = maxLocation = location;
              }
            } else {
              return responder.failure(new LuciusError(E.INVALID_TYPE, {parameter: 'location'}));
            }
          }

          const events = await db.getEvents(pageSize, pageNumber, minLocation, maxLocation);
          const records = events.map(mapEvent).map(filterFieldsEvents);
          const total = await db.countEvents(minLocation, maxLocation);
          return responder.success({total, pageSize, pageNumber, records});
        })
    });
    lucius.register('role:db,cmd:getUserOwnEvents', async function (connector, args, __) {
        return connector
            .input(args)
            .use(async function ({pageSize, pageNumber}, responder) {
                const events = await db.getUserOwnEvents(__.user.id, pageSize, pageNumber);
                const records = events.map(mapEvent).map(filterFieldsEvents);
                const total = await db.countUserEvents(__.user.id);
                return responder.success({total, pageSize, pageNumber, records});
            })
    });
    lucius.register('role:db,cmd:getEventById', async function (connector, args) {
        return connector
            .input({id: args.id})
            .use(async function (request, responder) {
                const event = await db.getEvent(request.id);
                if (!event) {
                    return responder.failure(new LuciusError(E.EVENT_NOT_FOUND, {id: request.id}));
                }
                const createdByUser = await db.getAccount(event.createdBy);
                if (createdByUser && createdByUser.name) {
                    event.createdByName = createdByUser.name;
                }
                if (event.createdByName && event.updatedBy === event.createdBy) {
                    event.updatedByName = event.createdByName;
                }
                else {
                    const updatedByUser = await db.getAccount(event.updatedBy);
                    if (updatedByUser && updatedByUser.name) {
                        event.updatedByName = updatedByUser.name;
                    }
                }
                return responder.success(event);
            })
    });
};