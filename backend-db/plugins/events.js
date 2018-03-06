'use strict'
const { E, LuciusError, Lucius } = require('module-lucius')
const util = require('module-util')
const db = require('../modules/db')
const { Dataset, Account, Image } = require('../modules/db/types')

const PLUGIN_NAME = 'events'

module.exports = function () {
  const lucius = new Lucius(this)

  lucius.pluginInit(PLUGIN_NAME, next => {
      db.ready().then(() => next()).catch(e => next(e))
  })
  lucius.register('role:db,cmd:createEvent', async function (connector, args, __) {
    console.log('123test', args)
    return connector
    // verify that the dataset exists
    .request('role:db,cmd:getDatasetById', {id: args.event.datasetId})
    .set('dataset')
    // check in which areas the trashpoint falls
    .input(args.event)
    .input(event => ({
        longitude: event.location.longitude,
        latitude: event.location.latitude,
    }))
    .request('role:geo,cmd:resolveLocation')
    .set('areas')
    // create the event
    .get(['dataset', 'areas'])
    .use(async function ({areas, dataset}, responder) {
        args.event.areas = areas;
        return responder.success(await db.createEvent(dataset.id, __.user.id, args.event));
    });
  })
}
