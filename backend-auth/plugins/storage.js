'use strict';
const {Lucius} = require('module-lucius');
const azureStorage = require('../modules/azure/storage');
const url = require('url');
const path = require('path');

const PLUGIN_NAME = 'storage';

module.exports = function () {
    const lucius = new Lucius(this);

    lucius.pluginInit(PLUGIN_NAME);

    lucius.register('role:auth,cmd:deleteBlob', async function (connector, args) {
        // args: container, file
        return connector.input(args)
        .use(async function (args, responder) {
            await azureStorage.deleteBlob(args.container, args.file);
            return responder.success();
        })
    });

    lucius.register('role:auth,cmd:getBlobURL', async function (connector, args) {
        // args: imageId, container, file, server
        return connector.input(args)
        .use(async function ({imageId, container, file}, responder) {
            const response = {
                imageId,
                //FIXME: use the server sent in the request
                url: azureStorage.getBlobURL(container, file),
            };
            return responder.success(response);
        })
    });

    lucius.register('role:auth,cmd:authorizeStorage', async function (connector, args) {
        // args: id, trashpointId, type, container
        return connector.input(args)
        .use(async function (image, responder) {
            const blobName = image.trashpointId + '_' + image.id + '.jpg';

            const sas = azureStorage.getBlobSAS(image.container, blobName, 10);
            const server = azureStorage.getServer();
            const urlInfo = url.parse(sas);
            delete urlInfo.search;
            delete urlInfo.query;

            const response = {
                sas: sas,
                id: image.id,
                name: blobName,
                server,
                url: url.format(urlInfo),
                file: path.basename(urlInfo.pathname),
            };
            return responder.success(response);
        })
    });

    return PLUGIN_NAME;
};
