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
    return connector
    .use(async function ({areas, dataset}, responder) {
        return responder.success(await db.createEvent(dataset.id, __.user.id, args.event));
    });
  })
}
