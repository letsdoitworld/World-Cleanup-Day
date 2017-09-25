'use strict';

module.exports = {
    /**
     * Converts a parameter for the MapQuery and MapQueryGrid Swagger requests,
     * which would otherwise introduce a breaking change. This allows mobile
     * clients in the wild to continue sending the 'scale' parameter, which
     * indicated the cell size using a hashtable, and transparently converts
     * it to the new version, where clients are expected to send the cell size
     * directly.
     */
    convertGeoScale: queryVal => {
        const OLD_GRID_SCALES = {
            '1000km': 9,
            '500km': 4.5,
            '300km': 2.7,
            '200km': 1.8,
            '180km': 1.62,
            '160km': 1.44,
            '140km': 1.26,
            '120km': 1.08,
            '100km': 0.9,
            '90km': 0.81,
            '80km': 0.72,
            '70km': 0.63,
            '60km': 0.54,
            '50km': 0.45,
            '30km': 0.27,
            '20km': 0.18,
            '10km': 0.09,
            '5km': 0.045,
            '3km': 0.027,
            '2km': 0.018,
            '1km': 0.009,
            '500m': 0.0045,
            '300m': 0.0027,
            '200m': 0.0018,
            '100m': 0.0009,
            '50m': 0.00045,
            '30m': 0.00027,
            '20m': 0.00018,
            '10m': 0.00009,
            '5m': 0.000045,
            '1m': 0.000009,
        };
        if (queryVal['scale'] && !queryVal['cellSize'] && OLD_GRID_SCALES[queryVal['scale']]) {
            queryVal['cellSize'] = OLD_GRID_SCALES[queryVal['scale']];
            delete queryVal.scale;
        }
        return queryVal;
    },
};
