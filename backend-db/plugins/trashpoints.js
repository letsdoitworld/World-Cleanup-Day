'use strict';
const {E, LuciusError, Lucius} = require('module-lucius');
const util = require('module-util');
const db = require('../modules/db');
const {Dataset, Account, Image} = require('../modules/db/types');

const PLUGIN_NAME = 'trashpoints';

const filterTrashpointsForAdmin = value => util.object.filter(
    value,
    {id:true, status: true, name: true, address: true, location: true}
);

const filterTrashpointsForOverview = value => util.object.filter(
    value,
    {id: true, status: true, location: true}
);

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
        db.ready().then(() => next()).catch(e => next(e));
    });

    lucius.register('role:db,cmd:getAdminTrashpoints',async function (connector, args) {
        return connector
        .input(args)
        .use(async function ({pageSize, pageNumber}, responder) {
            const trashpoints = await db.getAdminTrashpoints(pageSize, pageNumber);
            const outTrashpoints = trashpoints.map(filterTrashpointsForAdmin);
            const trashCount = await db.countTrashpoints();
            return responder.success({
                total: trashCount,
                pageSize,
                pageNumber,
                records: outTrashpoints,
            });
        });
    });

    lucius.register('role:db,cmd:getTrashpointById', async function (connector, args) {
        return connector
        .input({id: args.id})
        .use(async function (request, responder) {
            const trashpoint = await db.getTrashpoint(request.id);
            if (!trashpoint) {
                return responder.failure(new LuciusError(E.TRASHPOINT_NOT_FOUND, {id: request.id}));
            }
            const createdByUser = await db.getAccount(trashpoint.createdBy);
            if (createdByUser && createdByUser.name) {
                trashpoint.createdByName = createdByUser.name;
            }
            if (trashpoint.createdByName && trashpoint.updatedBy === trashpoint.createdBy) {
                trashpoint.updatedByName = trashpoint.createdByName;
            }
            else {
                const updatedByUser = await db.getAccount(trashpoint.updatedBy);
                if (updatedByUser && updatedByUser.name) {
                    trashpoint.updatedByName = updatedByUser.name;
                }
            }
            return responder.success(trashpoint);
        })
    });

    lucius.register('role:db,cmd:getUserOwnTrashpoints', async function (connector, args, __) {
        return connector
        .input(args)
        .use(async function ({pageSize, pageNumber}, responder) {
            const trashpoints = await db.getUserTrashpoints(__.user.id, pageSize, pageNumber);
            const records = trashpoints.map(filterTrashpointsForAdmin);
            const total = await db.countUserTrashpoints(__.user.id);
            return responder.success({
                total,
                pageSize,
                pageNumber,
                records,
            });
        })
    });

    lucius.register('role:db,cmd:getClustersOverview', async function (connector, args) {
        return connector.input(args)
        // verify that dataset exists and is the right type
        .connect(connectVerifyDataset)
        // fetch clusters
        .use(async function (dataset, responder) {
            const clusters = await fetchRectangleMarkers(
                dataset.id, args.cellSize, args.rectangle, db.getOverviewClusters);
            const filtered = clusters.map(value => util.object.filter(
                value,
                {count: true, status: true, location: true, coordinates: true}
            ));
            return responder.success(filtered);
        })
    });

    lucius.register('role:db,cmd:getTrashpointsOverview', async function (connector, args) {
        return connector.input(args)
        // verify that dataset exists and is the right type
        .connect(connectVerifyDataset)
        // fetch trashpoints
        .use(async function (dataset, responder) {
            const trashpoints = await fetchRectangleMarkers(
                dataset.id, args.cellSize, args.rectangle, db.getOverviewTrashpoints);
            const filtered = trashpoints.map(filterTrashpointsForOverview);
            return responder.success(filtered);
        })
    });

    lucius.register('role:db,cmd:getTrashpointsInGridCell', async function (connector, args) {
        return connector.input(args)
        // verify that dataset exists and is the right type
        .connect(connectVerifyDataset)
        // fetch trashpoints
        .use(async function (dataset, responder) {
            const trashpoints = await db.getGridCellTrashpoints(
                dataset.id,
                args.cellSize,
                args.coordinates
            );
            const filtered = trashpoints.map(filterTrashpointsForOverview);
            return responder.success(filtered);
        })
    });

    lucius.register('role:db,cmd:modifyTrashpoint', async function (connector, args, __) {
        return connector.input(args)
        .set('request')
        // check in which areas the trashpoint falls
        .input(args.trashpointData)
        .input(trashpoint => ({
            longitude: trashpoint.location.longitude,
            latitude: trashpoint.location.latitude,
        }))
        .request('role:geo,cmd:resolveLocation')
        .set('areas')
        // update the trashpoint
        .get(['areas', 'request'])
        .use(async function ({areas, request}, responder) {
            const trashpointId = request.trashpointId;
            const trashpointData = request.trashpointData;
            trashpointData.areas = areas;
            const trashpoint = await db.modifyTrashpoint(trashpointId, __.user.id, trashpointData);
            if (!trashpoint) {
                return responder.failure(new LuciusError(E.TRASHPOINT_NOT_FOUND, {id: trashpointId}));
            }
            return responder.success(trashpoint);
        })
    });

    lucius.register('role:db,cmd:createTrashpoint', async function (connector, args, __) {
        return connector
        // verify that the dataset exists
        .request('role:db,cmd:getDatasetById', {id: args.trashpoint.datasetId})
        .set('dataset')
        // check in which areas the trashpoint falls
        .input(args.trashpoint)
        .input(trashpoint => ({
            longitude: trashpoint.location.longitude,
            latitude: trashpoint.location.latitude,
        }))
        .request('role:geo,cmd:resolveLocation')
        .set('areas')
        // create the trashpoint
        .get(['dataset', 'areas'])
        .use(async function ({areas, dataset}, responder) {
            args.trashpoint.areas = areas;
            args.trashpoint.team = __.user.team;
            return responder.success(await db.createTrashpoint(dataset.id, __.user.id, args.trashpoint));
        });
    });

    lucius.register('role:db,cmd:getAreaTrashpoints', async function (connector, args, __) {
        return connector.input(args)
        .use(async function ({areaId, pageSize, pageNumber}, responder) {
            // perform verifications on the area, but only if it's not the "other" area
            if (areaId) {
                // attempt to fetch area
                const area = await db.getArea(areaId);
                if (!area) {
                    return responder.failure(new LuciusError(E.AREA_NOT_FOUND, {id: areaId}))
                }
                // superadmins are allowed to see trashpoints from any area, but leaders need more checks
                if (__.user.role !== Account.ROLE_SUPERADMIN) {
                    // user needs to be leader of the area
                    if (area.leaderId !== __.user.id) {
                        // if she's not, she might be the leader of an area enclosing this one
                        if (!await db.areaIsInherited(__.user.id, areaId)) {
                            // if that's not true either, pretend that area doesn't exist
                            return responder.failure(new LuciusError(E.AREA_NOT_FOUND, {id: areaId}))
                        }
                    }
                }
            }
            // fetch data
            const statusCounts = await db.countAreaTrashpoints(areaId, true);
            const total = Object.values(statusCounts).reduce((sum, cnt) => sum += cnt, 0);
            const response = {
                total: total,
                records: await db.getAreaTrashpoints(areaId, pageSize, pageNumber),
                statusCounts,
                pageSize,
                pageNumber,
            }
            return responder.success(response);
        })
    });

    lucius.register('role:db,cmd:deleteTrashpoint', async function (connector, args, __) {
        return connector
        .input(args)
        // check that trashpoint exists
        .use(async function ({trashpointId}, responder) {
            const trashpoint = await db.getTrashpoint(trashpointId);
            if (!trashpoint) {
                return responder.failure(new LuciusError(E.TRASHPOINT_NOT_FOUND, {id: trashpointId}));
            }
            return responder.success(trashpoint);
        })
        .set('trashpoint')
        // check if user may delete
        .use(async function (trashpoint, responder) {
            // superadmin can delete any trashpoint
            if (__.user.role === Account.ROLE_SUPERADMIN) {
                return responder.success();
            }
            // if user is the trashpoint's creator
            if (trashpoint.createdBy === __.user.id
                // they can only delete it during the first 24h
                && trashpoint.createdAt >= util.time.getNowUTCShifted(-24, 'hours')
            ) {
                return responder.success();
            }
            // area leader can remove it only if trashpoint falls in one of their areas
            else if (__.user.role === Account.ROLE_LEADER) {
                const leadAreas = await db.getAreasForLeader(__.user.id);
                if (Array.isArray(leadAreas) && Array.isArray(trashpoint.areas)) {
                    const userAreas = leadAreas.map(area => area.id);
                    for (let uA of userAreas) {
                        for (let tA of trashpoint.areas) {
                            if (uA === tA) {
                                return responder.success();
                            }
                        }
                    }
                }
            }
            // found no reason to allow delete
            return responder.failure(new LuciusError(E.ACCESS_DENIED))
        })
        // obtain image ids (all statuses)
        .get(['trashpoint'])
        .request('role:db,cmd:getTrashpointImageSimple')
        .input(images => images.filter(img => img.type === Image.TYPE_MEDIUM).map(img => img.id))
        .set('imageIds')
        // delete the trashpoint images
        .get(['trashpoint', 'imageIds'])
        .input(({trashpoint, imageIds}) => ({
            trashpointId: trashpoint.id,
            request: {
                delete: imageIds,
            },
        }))
        .request('role:db,cmd:deleteTrashpointImages')
        // delete the trashpoint
        .get(['trashpoint'])
        .use(async function ({trashpoint}, responder) {
            const ret = await db.removeTrashpoint(trashpoint.id);
            if (!ret) {
                return responder.failure(new LuciusError(E.TRASHPOINT_NOT_FOUND, {id: trashpoint.id}))
            }
            return responder.success();
        })
    });

    return PLUGIN_NAME;
};
