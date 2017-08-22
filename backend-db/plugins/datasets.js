'use strict';
const {E, LuciusError, Lucius} = require('module-lucius');
const util = require('module-util');
const db = require('../modules/db');
const {Dataset} = require('../modules/db/types');

const PLUGIN_NAME = 'datasets';

module.exports = function () {
    const lucius = new Lucius(this);

    lucius.pluginInit(PLUGIN_NAME, next => {
        db.ready().then(() => next()).catch(e => next(e));
    });

    lucius.register('role:db,cmd:getDatasetById', async function (connector, args, __) {
        return connector.input(args)
        .use(async function (params, responder) {
            const dataset = await db.getDataset(params.id);
            if (!dataset) {
                return responder.failure(new LuciusError(E.DATASET_NOT_FOUND, {id: params.id}));
            }
            return responder.success(dataset);
        });
    });

    lucius.register('role:db,cmd:getAllDatasets', async function (connector, args, __) {
        return connector.input(args)
        .use(async function (foo, responder) {
            return responder.success(await db.getAllDatasets());
        })
        // if there are no trashpoint datasets, create one
        .use(async function (datasets, responder) {
            const anyTrashpointSet = datasets.find(
                set => set.type === Dataset.TYPE_TRASHPOINTS);
            if (!anyTrashpointSet) {
                datasets.push(await db.createDataset(Dataset.TYPE_TRASHPOINTS));
            }
            return responder.success(datasets);
        })
        // filter only data relevant to the endpoint
        .use(async function (datasets, responder) {
            return responder.success(datasets.map(
                set => util.object.filter(set, {id:true, type: true})
            ));
        });
    });

    return PLUGIN_NAME;
};
