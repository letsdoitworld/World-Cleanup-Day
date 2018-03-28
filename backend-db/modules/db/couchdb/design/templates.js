'use strict';

/*global emit $$LENGTH$$ $$GRID_CONVERTER$$ */
module.exports = {
    isolatedTrashpoints: {
        map: function (doc) {
            if (doc.$doctype !== 'trashpoint') {
                return;
            }

            var LENGTH = $$LENGTH$$;
            var GRID_CONVERTER = $$GRID_CONVERTER$$;

            var gridCoords = GRID_CONVERTER(
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
        reduce: function (keys, values) {
            // XXX: the logic for reduce and rereduce is the same.
            // eliminate clusters with more than one trashpoint
            if (values.length > 1) {
                return null;
            }
            // return the trashpoint itself, if any
            return values[0];
        },
    },

    trashpointsByGridCell: {
        map: function (doc) {
            if (doc.$doctype !== 'trashpoint') {
                return;
            }

            var LENGTH = $$LENGTH$$;
            var GRID_CONVERTER = $$GRID_CONVERTER$$;

            var gridCoords = GRID_CONVERTER(
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

            var LENGTH = $$LENGTH$$;
            var GRID_CONVERTER = $$GRID_CONVERTER$$;

            var docCoords = [doc.location.longitude, doc.location.latitude];
            emit([
                doc.datasetId,
                GRID_CONVERTER(docCoords, LENGTH),
                docCoords,
            ], doc.status);
        },
        reduce: function (keys, values, rereduce) {
            function clusterLocation(locs) {
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
            function clusterStatus(data, statExtractor) {
                var states = ['threat', 'regular', 'cleaned', 'outdated'];
                var priorities = states.reduce(function (red, val, idx) {
                    red[val] = idx;
                    return red;
                }, {});
                var mostUrgent = data.reduce(function (prev, curr) {
                    return Math.min(prev, priorities[statExtractor(curr)]);
                }, states.length - 1);
                return states[mostUrgent];
            }
            if (rereduce) {
                values = values.filter(function (val) { return val !== null; });
                return {
                    status: clusterStatus(values, function (x) { return x.status; }),
                    count: values.reduce(function (prev, curr) { return prev + curr.count; }, 0),
                    location: clusterLocation(values.map(function (val) {
                        return [val.location.longitude, val.location.latitude];
                    })),
                };
            } else {
                if (keys.length < 2) {
                    return null;
                }
                return {
                    status: clusterStatus(values, function (x) { return x; }),
                    count: keys.length,
                    location: clusterLocation(keys.map(function (val) {
                        return val[0][2];
                    })),
                };
            }
        },
    },

    isolatedEvents: {
        map: function (doc) {
          if (doc.$doctype !== 'event') {
            return;
          }

          var LENGTH = $$LENGTH$$;
          var GRID_CONVERTER = $$GRID_CONVERTER$$;

          var gridCoords = GRID_CONVERTER(
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
        reduce: function (keys, values) {
          // XXX: the logic for reduce and rereduce is the same.
          // eliminate clusters with more than one trashpoint
          if (values.length > 1) {
            return null;
          }
          // return the trashpoint itself, if any
          return values[0];
        },
    },

    eventsByGridCell: {
        map: function (doc) {
          if (doc.$doctype !== 'event') {
            return;
          }

          var LENGTH = $$LENGTH$$;
          var GRID_CONVERTER = $$GRID_CONVERTER$$;

          var gridCoords = GRID_CONVERTER(
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

    eventClusters: {
      map: function (doc) {
        if (doc.$doctype !== 'event') {
          return;
        }

        var LENGTH = $$LENGTH$$;
        var GRID_CONVERTER = $$GRID_CONVERTER$$;

        var docCoords = [doc.location.longitude, doc.location.latitude];
        emit([
          doc.datasetId,
          GRID_CONVERTER(docCoords, LENGTH),
          docCoords,
        ], doc.status);
      },
      reduce: function (keys, values, rereduce) {
        function clusterLocation(locs) {
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

        function clusterStatus(data, statExtractor) {
          var states = ['threat', 'regular', 'cleaned', 'outdated'];
          var priorities = states.reduce(function (red, val, idx) {
            red[val] = idx;
            return red;
          }, {});
          var mostUrgent = data.reduce(function (prev, curr) {
            return Math.min(prev, priorities[statExtractor(curr)]);
          }, states.length - 1);
          return states[mostUrgent];
        }

        if (rereduce) {
          values = values.filter(function (val) {
            return val !== null;
          });
          return {
            status: clusterStatus(values, function (x) {
              return x.status;
            }),
            count: values.reduce(function (prev, curr) {
              return prev + curr.count;
            }, 0),
            location: clusterLocation(values.map(function (val) {
              return [val.location.longitude, val.location.latitude];
            })),
          };
        } else {
          if (keys.length < 2) {
            return null;
          }
          return {
            status: clusterStatus(values, function (x) {
              return x;
            }),
            count: keys.length,
            location: clusterLocation(keys.map(function (val) {
              return val[0][2];
            })),
          };
        }
      },
    },
};
