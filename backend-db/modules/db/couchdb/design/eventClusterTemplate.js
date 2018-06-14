'use strict';

module.exports = {
    map: function (doc) {
        var LENGTH = $$LENGTH$$;
        var GRID_CONVERTER = $$GRID_CONVERTER$$;

        var docCoords = [doc.location.longitude, doc.location.latitude];
        emit([
            doc.datasetId,
            GRID_CONVERTER(docCoords, LENGTH),
            docCoords,
        ], {
            _id: doc._id,
            status: doc.status,
            photos: doc.photos,
            name: doc.name,
            coordinatorName: doc.coordinatorName,
            maxPeopleAmount: doc.maxPeopleAmount,
            attendeesAmount: doc.attendeesAmount,
            eventContainer: doc.eventContainer,
            eventImage: doc.eventImage
        });
    },
    reduce: function (keys, values, rereduce) {
        function clusterLocation(locs) {
            if (locs.length === 1) {
                return {
                    longitude: locs[0][0],
                    latitude: locs[0][1],
                };
            }
            var minLong = null;
            var maxLong = null;
            var minLat = null;
            var maxLat = null;
            for (var i = 0; i < locs.length; i++) {
                minLong = typeof minLong === 'number' ? Math.min(locs[i][0], minLong) : locs[i][0];
                maxLong = typeof maxLong === 'number' ? Math.max(locs[i][0], maxLong) : locs[i][0];
                minLat = typeof minLat === 'number' ? Math.min(locs[i][1], minLat) : locs[i][1];
                maxLat = typeof maxLat === 'number' ? Math.max(locs[i][1], maxLat) : locs[i][1];
            }
            return {
                longitude: minLong + (maxLong - minLong) / 2,
                latitude: minLat + (maxLat - minLat) / 2,
            };
        }

        if (rereduce) {
            return {
                _id: values[0]._id,
                count: values.reduce(function (prev, curr) {
                    return prev + curr.count;
                }, 0),
                location: clusterLocation(values.map(function (val) {
                    return [val.location.longitude, val.location.latitude];
                })),
                photos: values[0].photos,
                name: values[0].name,
                coordinatorName: values[0].coordinatorName,
                maxPeopleAmount: values[0].maxPeopleAmount,
                attendeesAmount: values[0].attendeesAmount,
                eventContainer: values[0].eventContainer,
                eventImage: values[0].eventImage
            };
        }

        return {
            _id: values[0]._id,
            count: values.length,
            location: clusterLocation(keys.map(function (val) {
                return val[0][2];
            })),
            photos: values[0].photos,
            name: values[0].name,
            coordinatorName: values[0].coordinatorName,
            maxPeopleAmount: values[0].maxPeopleAmount,
            attendeesAmount: values[0].attendeesAmount,
            eventContainer: values[0].eventContainer,
            eventImage: values[0].eventImage
        };
    },
};