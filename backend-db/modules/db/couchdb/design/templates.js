'use strict';

const clusterTemplate = require('./clusterTemplate');

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
    },

    trashpointClusters: clusterTemplate,

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

    eventClusters: clusterTemplate,
};
