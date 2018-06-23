'use strict';

const trashpointClusterTemplate = require('./trashpointClusterTemplate');
const eventClusterTemplate = require('./trashpointClusterTemplate');

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
            emit([doc.datasetId, gridCoords], doc);
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
            emit([doc.datasetId, gridCoords], doc);
        },
        reduce: function (keys, values, rereduce) {
            if (rereduce) {
                values[0].count = values.reduce(function (prev, curr) { return prev + curr.count; }, 0);
                return  values[0];
            }

            values[0].count = values.length;
            return  values[0];
        },
    },

    trashpointClusters: trashpointClusterTemplate,

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
          ], doc);
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
          ], doc);
        },
    },

    eventClusters: eventClusterTemplate,
};
