'use strict';
const {E, LuciusError, Lucius} = require('module-lucius');
const memory = require('../modules/memory');

const PLUGIN_NAME = 'areas';

module.exports = function () {
    const lucius = new Lucius(this);

    lucius.pluginInit(PLUGIN_NAME, next => {
        memory.READY.then(() => next()).catch(e => next(e));
    });

    lucius.register('role:geo,cmd:getAllAreas', async function (connector, args, __) {
        return connector
        .use(async function (foo, responder) {
            return responder.success(await memory.getAllAreasMetadata());
        })
    });

    lucius.register('role:geo,cmd:resolveLocation', async function (connector, args, __) {
        return connector.input(args)
        .use(async function ({longitude, latitude}, responder) {
            return responder.success(await memory.getAreasForLocation(longitude, latitude));
        })
    });

    return PLUGIN_NAME;
};
