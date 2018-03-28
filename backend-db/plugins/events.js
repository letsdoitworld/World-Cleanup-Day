'use strict';
const {E, LuciusError, Lucius} = require('module-lucius');
const util = require('module-util');
const db = require('../modules/db');
const {Dataset, Account, Image} = require('../modules/db/types');
const sortByDistance = require('sort-by-distance');
const _ = require("lodash");

const PLUGIN_NAME = 'events';

const mapEvent = async event => {
    event.peopleAmount = event.peoples ? event.peoples.length : 0;
    if (event.createdBy) {
      const createdByUser = await db.getAccount(event.createdBy);
      event.creator = _.pick(createdByUser, ['id', 'name', 'email', 'pictureURL']);
      event.createdByName = createdByUser.name;
    }
    if (event.updatedBy) {
      if (event.creator && event.updatedBy === event.createdBy) {
        event.updater = event.creator;
        event.updatedByName = event.createdByName;
      } else {
        const updatedByUser = await db.getAccount(event.updatedBy);
        if (updatedByUser) {
          event.updater = _.pick(updatedByUser, ['id', 'name', 'email', 'pictureURL']);
          event.updatedByName = updatedByUser.name;
        }
      }
    }
    event.photos = await db.getEventImagesByType(event.id, Image.TYPE_MEDIUM);
    event.photos = event.photos.map(p => p.url);
    if (event.trashpoints) {
      event.trashpoints = await Promise.all(await event.trashpoints.map(async (trashpointId) =>
        await db.getTrashpoint(trashpointId)));
      event.trashpoints = event.trashpoints.map(t => {
        if (t.location) {
          t.latitude = t.location.latitude;
          t.longitude = t.location.longitude;
        }
        return t;
      });
      event.trashpoints = sortByDistance(event.location, event.trashpoints, {yName: 'latitude', xName: 'longitude'});
      event.trashpoints = event.trashpoints.map(t => _.omit(t, ['latitude', 'longitude', 'distance']));
    } else {
      event.trashpoints = [];
    }
    return event;
};

const fetchRectangleMarkers = async (datasetId, cellSize, rectangle, fetcher) => {
  let markers = [];
  // see if the rectangle crosses the longitude separation line (180 to -180)
  if (rectangle.se.longitude < rectangle.nw.longitude) {
    // split the rectangle at the separation line
    // and request trashpoints from each of them
    const pointsLeft = await fetcher(
      datasetId,
      cellSize,
      rectangle.nw.latitude, rectangle.nw.longitude,
      rectangle.se.latitude, 180
    );
    const pointsRight = await fetcher(
      datasetId,
      cellSize,
      rectangle.nw.latitude, -180,
      rectangle.se.latitude, rectangle.se.longitude
    );
    // merge them
    markers = pointsLeft.concat(pointsRight);
  }
  else {
    markers = await fetcher(
      datasetId,
      cellSize,
      rectangle.nw.latitude, rectangle.nw.longitude,
      rectangle.se.latitude, rectangle.se.longitude
    );
  }
  // done
  return markers;
};

const connectVerifyDataset = async function (connector, input) {
  return connector
    .input({id: input.datasetId})
    // verify that the dataset exists
    .request('role:db,cmd:getDatasetById')
    // verify that dataset has correct type
    .use(async function (dataset, responder) {
      if (dataset.type !== Dataset.TYPE_TRASHPOINTS) {
        return responder.failure(
          new LuciusError(E.DATASET_TYPE_MISMATCH, {
            id: dataset.id, wantedType: Dataset.TYPE_TRASHPOINTS, 'actualType': dataset.type,
          })
        );
      }
      return responder.success(dataset);
    });
};

module.exports = function () {
    const lucius = new Lucius(this);

    lucius.pluginInit(PLUGIN_NAME, next => {
        db.ready().then(() => next()).catch(e => next(e))
    });

    lucius.register('role:db,cmd:getEventById', async function (connector, args) {
      return connector
        .input(args)
        .use(async function ({id}, responder) {
          const event = await db.getEvent(id);
          if (!event) {
            return responder.failure(new LuciusError(E.EVENT_NOT_FOUND, {id}));
          }
          const mappedEvent = await mapEvent(event);
          //TODO Status TRUE should be implemented all over the project. For now it's just mock data
          mappedEvent.status = true;
          return responder.success(mappedEvent);
        });
    });

    lucius.register('role:db,cmd:createEvent', async function (connector, args, __) {
        return connector
            // verify that the dataset exists
            .request('role:db,cmd:getDatasetById', {id: args.event.datasetId})
            .set('dataset')
            .input(args.event)
            .input(event => ({
              longitude: event.location.longitude,
              latitude: event.location.latitude,
            }))
            .request('role:geo,cmd:resolveLocation')
            .set('areas')
            // create the event
            .get(['areas'])
            .use(async function ({areas}, responder) {
                const event = args.event;
                args.event.areas = areas;
                const filteredTrashpoints = [];
                if (event.trashpoints) {
                  for (let trashpointId of event.trashpoints) {
                    let trashpoint = await db.getTrashpoint(trashpointId);
                    if (trashpoint) {
                      filteredTrashpoints.push(trashpoint);
                    }
                  }
                }
                event.trashpoints = filteredTrashpoints;
                const savedEvent = await db.createEvent(__.user.id, event);
                const mappedEvent = await mapEvent(savedEvent);
                //TODO Status TRUE should be implemented all over the project. For now it's just mock data
                mappedEvent.status = true;
                return responder.success(mappedEvent);
            });
    });
    lucius.register('role:db,cmd:getEvents', async function (connector, args) {
      return connector
        .input(args)
        .use(async function ({pageSize, pageNumber, location, name, area}, responder) {
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
          const { data: {rows, total_rows: total} } = await db.getEventsByNameOrderByDistance(pageSize, pageNumber, name, location, area);
          const records = await Promise.all(rows.map(mapEvent));
          return responder.success({total, pageSize, pageNumber, records});
        })
    });

    lucius.register('role:db,cmd:getEventsClustersOverview', async function (connector, args) {
      return connector.input(args)
        .connect(connectVerifyDataset)
        .use(async function (dataset, responder) {
          const clusters = await fetchRectangleMarkers(dataset.id, args.cellSize, args.rectangle, db.getEventsOverviewClusters);
          const filtered = clusters.map(value => util.object.filter(
            value,
            {count: true, location: true, coordinates: true}
          ));
          return responder.success(filtered);
        })
    });

  lucius.register('role:db,cmd:getEventsOverview', async function (connector, args) {
    return connector.input(args)
      .connect(connectVerifyDataset)
      .use(async function (dataset, responder) {
        const events = await fetchRectangleMarkers(dataset.id, args.cellSize, args.rectangle, db.getOverviewEvents);
        const records = await Promise.all(events.map(mapEvent));
        return responder.success(records);
      })
  });

  lucius.register('role:db,cmd:getEventsInGridCell', async function (connector, args) {
    return connector.input(args)
      .connect(connectVerifyDataset)
      .use(async function (dataset, responder) {
        const events = await db.getGridCellEvents(
          dataset.id,
          args.cellSize,
          args.coordinates
        );
        const filtered = events.map(e => _.pick(e, ['id', 'location']));
        return responder.success(filtered);
      })
  });

  lucius.register('role:db,cmd:getUserOwnEvents', async function (connector, args, __) {
      return connector
        .input(args)
        .use(async function ({pageSize, pageNumber}, responder) {
          const events = await db.getUserOwnEvents(__.user.id, pageSize, pageNumber);
          const records = await Promise.all(events.map(async (e) => await mapEvent(e)));
          const total = await db.countUserEvents(__.user.id);
          return responder.success({total, pageSize, pageNumber, records});
        })
    });
};