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
        ],              {
            _id: doc._id,
            maxPeopleAmount: doc.maxPeopleAmount,
            attendeesAmount: doc.attendeesAmount,
            startTime: doc.startTime,
            photos: doc.photos,
            coordinatorName: doc.coordinatorName,
            status: doc.status,
            isIncluded: doc.isIncluded,
            name: doc.name
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
        function clusterStatus(data) {
            if (data.length === 1) {
                return data[0].status;
            }
            var states = ['threat', 'urgent', 'regular', 'cleaned', 'outdated'];
            var priorities = states.reduce(function (red, val, idx) {
                red[val] = idx;
                return red;
            }, {});
            var mostUrgent = data.reduce(function (prev, curr) {
                return Math.min(prev, priorities[curr.status]);
            }, states.length - 1);
            return states[mostUrgent];
        }

        if (rereduce) {
            return {
                _id: values[0]._id,
                maxPeopleAmount: values[0].maxPeopleAmount,
                attendeesAmount: values[0].attendeesAmount,
                startTime: values[0].startTime,
                coordinatorName: values[0].coordinatorName,
                photos: values[0].photos,
                status: clusterStatus(values),
                count: values.reduce(function (prev, curr) { return prev + curr.count; }, 0),
                location: clusterLocation(values.map(function (val) {
                    return [val.location.longitude, val.location.latitude];
                })),
                isIncluded: values[0].isIncluded,
                name: values[0].name,
            };
        }

        return {
            _id: values[0]._id,
            maxPeopleAmount: values[0].maxPeopleAmount,
            attendeesAmount: values[0].attendeesAmount,
            startTime: values[0].startTime,
            coordinatorName: values[0].coordinatorName,
            photos: values[0].photos,
            status: clusterStatus(values),
            count: values.length,
            location: clusterLocation(keys.map(function (val) {
                return val[0][2];
            })),
            isIncluded: values[0].isIncluded,
            name: values[0].name,
        };
    },
};