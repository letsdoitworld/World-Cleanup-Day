'use strict';

/*global emit $$LENGTH$$ $$GRID_CONVERTER$$ $$GET_CELL_CENTER$$ */
module.exports = {
    isolatedTrashpoints: {
        map: function (doc) {
            if (doc.$doctype !== 'trashpoint') {
                return;
            }

            const LENGTH = $$LENGTH$$;
            const GRID_CONVERTER = $$GRID_CONVERTER$$;

            const gridCoords = GRID_CONVERTER(
                [doc.location.longitude, doc.location.latitude],
                LENGTH
            );
            emit([
                doc.datasetId,
                gridCoords,
            ], {
                _id: doc._id,
                location: doc.location,
                status: doc.status,
            });
        },
        reduce: function (keys, values, rereduce) {
            if (rereduce) {
                // filter out clusters eliminated during reduce
                values = values.filter(function (val) { return val !== null; });
                // return the trashpoint itself
                return values[0];
            } else {
                // eliminate clusters with more than one trashpoint
                if (values.length > 1) {
                    return null;
                }
                // return the trashpoint itself
                return values[0];
            }
        },
    },

    trashpointsByGridCell: {
        map: function (doc) {
            if (doc.$doctype !== 'trashpoint') {
                return;
            }

            const LENGTH = $$LENGTH$$;
            const GRID_CONVERTER = $$GRID_CONVERTER$$;

            const gridCoords = GRID_CONVERTER(
                [doc.location.longitude, doc.location.latitude],
                LENGTH
            );
            emit([
                doc.datasetId,
                gridCoords,
            ], {
                _id: doc._id,
                location: doc.location,
                status: doc.status,
            });
        },
    },

    trashpointClusters: {
        map: function (doc) {
            if (doc.$doctype !== 'trashpoint') {
                return;
            }

            const LENGTH = $$LENGTH$$;
            const GRID_CONVERTER = $$GRID_CONVERTER$$;

            const gridCoords = GRID_CONVERTER(
                [doc.location.longitude, doc.location.latitude],
                LENGTH
            );
            emit([
                doc.datasetId,
                gridCoords,
            ], doc.status);
        },
        reduce: function (keys, values, rereduce) {
            const LENGTH = $$LENGTH$$;
            const GET_CELL_CENTER = $$GET_CELL_CENTER$$;
            const clusterStatus = function (data, statExtractor) {
                const states = ['threat', 'regular', 'cleaned', 'outdated'];
                const priorities = states.reduce(function (red, val, idx) {
                    red[val] = idx;
                    return red;
                }, {});
                const mostUrgent = data.reduce(function (prev, curr) {
                    return Math.min(prev, priorities[statExtractor(curr)]);
                }, states.length - 1);
                return states[mostUrgent];
            };
            if (rereduce) {
                values = values.filter(function (val) { return val !== null; });
                return {
                    status: clusterStatus(values, function (x) { return x.status; }),
                    count: values.reduce(function (prev, curr) { return prev + curr.count; }, 0),
                    location: values[0].location,
                };
            } else {
                if (keys.length < 2) {
                    return null;
                }
                const cellCenter = GET_CELL_CENTER(keys[0][0][1], LENGTH);
                return {
                    status: clusterStatus(values, function (x) { return x; }),
                    count: keys.length,
                    location: {
                        longitude: cellCenter[0],
                        latitude: cellCenter[1],
                    },
                };
            }
        },
    },
};
