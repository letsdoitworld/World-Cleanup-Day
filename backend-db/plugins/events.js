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
  'endTime', 'email', 'phonenumber', 'whatToBring', 'maxPeopleAmount', 'peopleAmount', 'createdByName',
  'updatedByName']);

const mapEvent = event => {
    event.peopleAmount = event.peoples ? event.peoples.length : 0;
    return event;
};

module.exports = function () {
    const lucius = new Lucius(this);
    lucius.pluginInit(PLUGIN_NAME, next => {
        db.ready().then(() => next()).catch(e => next(e))
    });
    lucius.register('role:db,cmd:getEventById', async function (connector, args, __) {
      return connector
        .input(args)
        .use(async function ({id}, responder) {
          const event = await db.getEvent(id);
          if (!event) {
            return responder.failure(new LuciusError(E.EVENT_NOT_FOUND, {id: request.id}));
          }
          if (event.createdBy) {
            const createdByUser = await db.getAccount(event.createdBy);
            if (createdByUser) {
              event.createdByName = createdByUser.name;
            }
          }
          if (event.updatedBy) {
            if (event.createdByName && event.updatedBy === event.createdBy) {
              event.updatedByName = event.createdByName;
            }
            else {
              const updatedByUser = await db.getAccount(event.updatedBy);
              if (updatedByUser) {
                event.updatedByName = updatedByUser.name;
              }
            }
          }
          if (event.trashpoints) {
            event.trashpoints = await Promise.all(await event.trashpoints.map(async (trashpointId) =>
                _.pick((await db.getTrashpoint(trashpointId)), ["id", "isIncluded", "status", "location", "name"])));
            event.trashpoints = event.trashpoints.map(t => {
              t.latitude = t.location.latitude;
              t.longitude = t.location.longitude;
              return t;
            });
            event.trashpoints = sortByDistance(event.location, event.trashpoints, {yName: 'latitude', xName: 'longitude'});
            event.trashpoints = event.trashpoints.map(t => _.omit(t, ['latitude', 'longitude', 'distance']));
          }
          const mappedEvent = mapEvent(event);
          //TODO Status TRUE should be implemented all over the project. For now it's just mock data
          mappedEvent.status = true;
          return responder.success(mappedEvent);
        });
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
        .use(async function ({pageSize, pageNumber, location, name}, responder) {
          if (location) {
            try {
              location = JSON.parse(location);
            } catch (e) {
              return responder.failure(new LuciusError(E.INVALID_TYPE, {parameter: 'location'}));
            }
            if (!location.latitude || !location.longitude) {
              return responder.failure(new LuciusError(E.INVALID_TYPE, {parameter: 'location'}));
            }
          }
          const { data: {rows, total_rows: total} } = await db.getEventsByNameOrderByDistance(pageSize, pageNumber, name, location);
          const records = await Promise.all(rows.map(async r => {
            const event = r.value;
            if (event.createdBy) {
              const createdByUser = await db.getAccount(event.createdBy);
              event.creator = _.pick(createdByUser, ['id', 'name', 'email', 'pictureURL']);
            }
            if (event.updatedBy) {
              if (event.creator && event.updatedBy === event.createdBy) {
                event.updater = event.creator;
              } else {
                const updatedByUser = await db.getAccount(event.updatedBy);
                if (updatedByUser) {
                  event.updater = _.pick(updatedByUser, ['id', 'name', 'email', 'pictureURL']);
                }
              }
            }
            // event.photos = await db.getEventImagesByType(event.id, Image.TYPE_MEDIUM);
            // event.photos = event.photos.map(p => p.url);
            if (event.trashpoints) {
              event.trashpoints = await Promise.all(await event.trashpoints.map(async (trashpointId) =>
                await db.getTrashpoint(trashpointId)));
              if (event.location) {
                event.trashpoints = event.trashpoints.map(t => {
                  t.latitude = t.location.latitude;
                  t.longitude = t.location.longitude;
                  return t;
                });
              }
              event.trashpoints = sortByDistance(event.location, event.trashpoints, {yName: 'latitude', xName: 'longitude'});
              event.trashpoints = event.trashpoints.map(t => _.omit(t, ['latitude', 'longitude', 'distance']));
            } else {
              event.trashpoints = [];
            }
            console.log(event);
            return mapEvent(event);
          }));
          return responder.success({total, pageSize, pageNumber, records});
        })
    });
    lucius.register('role:db,cmd:getEventsOverview', async function (connector, args) {
      return connector
        .input(args)
        .use(async function ({location, radius}, responder) {
          let minLocation, maxLocation;

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

          const events = await db.getEventsByLocation(minLocation, maxLocation);
          const records = events.map(mapEvent).map(filterFieldsEvents);
          return responder.success(records);
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
};