'use strict';
const {E, LuciusError, Lucius} = require('module-lucius');
const logger = require('module-logger');
const util = require('module-util');
const db = require('../modules/db');
const {Image} = require('../modules/db/types');

const PLUGIN_NAME = 'images';

const fetchImages = async function ({trashpoint, status}, responder) {
    const ret = await db.getTrashpointImages(trashpoint.id, status);
    const response = ret.map(img => util.object.filter(img, {
        id: true, trashpointId: true, type: true, file: true, parentId: true,
        server: true, url: true,
    }));
    return responder.success(response);
};

module.exports = function () {
    const lucius = new Lucius(this);

    lucius.pluginInit(PLUGIN_NAME, next => {
        db.ready().then(() => next()).catch(e => next(e));
    });

    lucius.register('role:db,cmd:allocateTrashpointImages', async function (connector, args, __) {
        // args: trashpointId, request{count}
        return connector.input(args)
        // verify that the trashpoint exists
        .request('role:db,cmd:getTrashpointById', {id: args.trashpointId})
        // create image entries in db
        .use(async function (trashpoint, responder) {
            const imgSet = [];
            for (let i = 0; i < args.request.count; i++) {
                const parentImg = await db.allocateImage(
                    Image.TYPE_MEDIUM, trashpoint.id, __.user.id
                );
                imgSet.push(parentImg);

                const thumbnailImg = await db.allocateImage(
                    Image.TYPE_THUMBNAIL, trashpoint.id, __.user.id, parentImg.id
                );
                imgSet.push(thumbnailImg);
            }
            return responder.success(imgSet);
        })
        .set('images')
        // obtain storage tokens from auth
        .input(images => {
            return images.map(img => {
                return {
                    id: img.id,
                    trashpointId: img.trashpointId,
                    type: img.type,
                    container: Image.makeContainerName(img.type),
                };
            });
        })
        .multiRequest('role:auth,cmd:authorizeStorage')
        .set('permissions')
        // update images in the database
        .use(async function (permissions, responder) {
            const errors = [];
            for (let i = 0; i < permissions.length; i++) {
                const img = await db.modifyImage(
                    permissions[i].id, __.user.id, {
                        file: permissions[i].file,
                        server: permissions[i].server,
                        url: permissions[i].url,
                    }
                );
                if (!img) {
                    errors.push(new LuciusError(E.IMAGE_NOT_FOUND, {id: permissions[i].id}));
                    continue;
                }
            }
            if (errors.length) {
                return responder.failure(errors);
            }
            return responder.success();
        })
        // assemble response
        .get(['images', 'permissions'])
        .use(async function ({images, permissions}, responder) {
            const response = images.map(img => {
                const perm = permissions.find(val => val.id === img.id);
                return {
                    permission: {
                        token: perm.sas,
                        resourceId: img.id,
                    },
                    type: img.type,
                };
            });
            return responder.success(response);
        })
    });

    lucius.register('role:db,cmd:deleteTrashpointImages', async function (connector, args, __) {
        // args: trashpointId, request.delete[image id, image id, ...]
        return connector.input(args)
        // verify that the trashpoint exists
        .request('role:db,cmd:getTrashpointById', {id: args.trashpointId})
        // delete images
        .use(async function (trashpoint, responder) {
            const errors = [];
            let deletedSomething = false;
            // go through all indicated images
            const images = args.request.delete;
            for (let i = 0; i < images.length; i++) {
                const mainImageId = images[i];
                const mainImg = await db.getImage(mainImageId);
                // check that each image exists
                if (!mainImg) {
                    errors.push(new LuciusError(E.IMAGE_NOT_FOUND, {id: mainImageId}));
                    continue;
                }
                // check image type
                else if (mainImg.type !== Image.TYPE_MEDIUM) {
                    errors.push(new LuciusError(E.IMAGE_NOT_MAIN, {id: mainImageId}));
                    continue;
                }
                // check image trashpoint
                else if (mainImg.trashpointId !== trashpoint.id) {
                    errors.push(new LuciusError(E.IMAGE_NOT_IN_TRASHPOINT,
                        {id: mainImageId, trashpointId: trashpoint.id}));
                    continue;
                }
                // all checks passed, process dependent images
                let deletedAllDeps = true;
                // find the dependents
                const dependents = await db.getChildImages(mainImageId, trashpoint.id);
                for (let k = 0; k < dependents.length; k++) {
                    const depImgId = dependents[k].id;

                    // delete dependent from storage (but only if it was confirmed uploaded)
                    if (dependents[k].status === Image.STATUS_READY) {
                        const storDelRequest = {
                            container: Image.makeContainerName(dependents[k].type),
                            file: dependents[k].file,
                        };
                        try {
                            const ret = await lucius.request('role:auth,cmd:deleteBlob', storDelRequest);
                            if (!ret.isSuccessful()) {
                                logger.error(ret.getErrors());
                                errors.push(new LuciusError(E.STORAGE_DELETE_FAILED,
                                    {
                                        resourceId: depImgId,
                                        container: storDelRequest.container,
                                        blob: storDelRequest.file,
                                    }
                                ));
                                deletedAllDeps = false;
                                continue;
                            }
                        } catch (e) {
                            logger.error(e);
                            errors.push(new LuciusError(E.STORAGE_DELETE_FAILED,
                                {
                                    resourceId: depImgId,
                                    container: storDelRequest.container,
                                    blob: storDelRequest.file,
                                }
                            ));
                            deletedAllDeps = false;
                            continue;
                        }
                        logger.debug(`Deleted dependent image '${depImgId}' from storage.`);
                    }

                    // delete dependent from db
                    try {
                        await db.removeImage(depImgId);
                        deletedSomething = true;
                    } catch (e) {
                        logger.error(e);
                        errors.push(new LuciusError(E.IMAGE_DELETE_FAILED, {id: depImgId}));
                        deletedAllDeps = false;
                    }
                    logger.debug(`Deleted dependent image '${depImgId}' from db.`);
                } // END OF dependent images for-loop

                if (deletedAllDeps) {
                    // delete main image from storage (but only if it was confirmed uploaded)
                    if (mainImg.status === Image.STATUS_READY) {
                        const delRequest = {
                            container: Image.makeContainerName(mainImg.type),
                            file: mainImg.file,
                        };
                        try {
                            const ret = await lucius.request('role:auth,cmd:deleteBlob', delRequest);
                            if (!ret.isSuccessful()) {
                                logger.error(ret.getErrors());
                                errors.push(new LuciusError(E.STORAGE_DELETE_FAILED,
                                    {
                                        resourceId: mainImageId,
                                        container: delRequest.container,
                                        blob: delRequest.file,
                                    }
                                ));
                                continue;
                            }
                        } catch (e) {
                            logger.error(e);
                            errors.push(new LuciusError(E.STORAGE_DELETE_FAILED,
                                {
                                    resourceId: mainImageId,
                                    container: delRequest.container,
                                    blob: delRequest.file,
                                }
                            ));
                            continue;
                        }
                        logger.debug(`Deleted main image '${mainImageId}' from storage.`);
                    }

                    // delete main image from db
                    try {
                        await db.removeImage(mainImageId);
                    } catch (e) {
                        logger.error(e);
                        errors.push(new LuciusError(E.IMAGE_DELETE_FAILED, {id: mainImageId}));
                    }
                    deletedSomething = true;
                    logger.debug(`Deleted main image '${mainImageId}' from db.`);
                }
            } // END OF main images for-loop

            // if at least one image was deleted, update trashpoint ts
            if (deletedSomething) {
                await db.touchTrashpoint(trashpoint.id, __.user.id);
            }

            if (errors.length) {
                return responder.failure(errors);
            }
            return responder.success();
        })
    });

    lucius.register('role:db,cmd:confirmTrashpointImages', async function (connector, args, __) {
        // args: trashpointId, request{confirmed[string], failed[string]}
        return connector.input(args)
        // verify that the trashpoint exists
        .request('role:db,cmd:getTrashpointById', {id: args.trashpointId})
        // update image entries in db
        .use(async function (trashpoint, responder) {
            const confirmedUpload = args.request.confirmed;
            const failedUpload = args.request.failed;
            const errors = [];
            let anythingChanged = false;
            // updated confirmed images
            for (let i = 0; i < confirmedUpload.length; i++) {
                const img = await db.getImage(confirmedUpload[i]);
                if (!img) {
                    errors.push(new LuciusError(E.IMAGE_NOT_FOUND, {id: confirmedUpload[i]}));
                } else if (img.status !== Image.STATUS_PENDING && img.status !== Image.STATUS_READY) {
                    errors.push(new LuciusError(E.IMAGE_NOT_PENDING, {id: confirmedUpload[i]}));
                } else {
                    try {
                        await db.modifyImage(confirmedUpload[i], __.user.id, {status: Image.STATUS_READY});
                        anythingChanged = true;
                    } catch (e) {
                        logger.error(e);
                        errors.push(new LuciusError(E.IMAGE_CONFIRM_FAILED, {id: confirmedUpload[i]}));
                    }
                }
            }
            // delete failed images
            for (let i = 0; i < failedUpload.length; i++) {
                const img = await db.getImage(failedUpload[i]);
                if (!img) {
                    errors.push(new LuciusError(E.IMAGE_NOT_FOUND, {id: failedUpload[i]}));
                } else if (img.status !== 'pending') {
                    errors.push(new LuciusError(E.IMAGE_NOT_PENDING, {id: failedUpload[i]}));
                } else {
                    try {
                        await db.removeImage(failedUpload[i]);
                        anythingChanged = true;
                    } catch (e) {
                        logger.error(e);
                        errors.push(new LuciusError(E.IMAGE_CONFIRM_FAILED, {id: failedUpload[i]}));
                    }
                }
            }
            // update trashpoint ts
            if (anythingChanged) {
                await db.touchTrashpoint(trashpoint.id, __.user.id);
            }
            // compose response
            if (errors.length) {
                return responder.failure(errors);
            }
            return responder.success();
        })
    });

    lucius.register('role:db,cmd:getTrashpointImageSimple', async function (connector, args, __) {
        //args: trashpoint, status
        return connector.input(args)
        .use(fetchImages)
        .input(images => images.map(img => util.object.filter(img, {id: true, status: true, type: true})))
    });

    lucius.register('role:db,cmd:getTrashpointImages', async function (connector, args, __) {
        //args: trashpointId
        return connector.input(args)
        // verify that the trashpoint exists
        .request('role:db,cmd:getTrashpointById', {id: args.trashpointId})
        // fetch images from db
        .input(trashpoint => ({
            trashpoint,
            status: Image.STATUS_READY,
        }))
        .use(fetchImages)
        .set('images')
        // fetch URLs for the images
        .input(images =>
            images
                // only need to generate url for images that don't have one cached
                .filter(img => !img.url)
                .map(img => ({
                    container: Image.makeContainerName(img.type),
                    file: img.file,
                    imageId: img.id,
                    server: img.server,
                }))
        )
        .multiRequest('role:auth,cmd:getBlobURL')
        .set('blobs')
        // assemble response
        .get(['images', 'blobs'])
        .use(async function ({images, blobs}, responder) {
            const response = images.map(img => {
                const ret = util.object.filter(img, {
                    id: true, trashpointId: true, type: true, parentId: true,
                });
                ret.url = img.url ? img.url : (blobs.find(item => item.imageId === img.id)).url;
                return ret;
            });
            return responder.success(response);
        })
    });

    return PLUGIN_NAME;
};
