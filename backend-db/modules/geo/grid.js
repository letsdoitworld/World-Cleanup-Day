'use strict';

//-------------------------------------------------------------------
// SQUARE GRID DEFINITIONS
//-------------------------------------------------------------------

const SQUARE_SCALES = {
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

const geodesicToSquareCell = function (geoCoords, gridSize) {
    return [
        parseInt(Math.floor(geoCoords[0] / gridSize)),
        parseInt(Math.floor(geoCoords[1] / gridSize)),
    ];
};

const squareCellCenterToGeodesic = function (gridCoords, gridSize) {
    return [
        (gridCoords[0] + 0.5) * gridSize,
        (gridCoords[1] + 0.5) * gridSize,
    ];
};

const geodesicPointsToSquareCellArea = function (geoPointA, geoPointB, gridSize) {
    const minLong = Math.min(geoPointA[0], geoPointB[0]);
    const minLat = Math.min(geoPointA[1], geoPointB[1]);
    const maxLong = Math.max(geoPointA[0], geoPointB[0]);
    const maxLat = Math.max(geoPointA[1], geoPointB[1]);
    return [
        geodesicToSquareCell([minLong, minLat], gridSize),
        geodesicToSquareCell([maxLong, maxLat], gridSize),
    ];
};

const isCellInSquareGridArea = function (cellCoords, gridCellA, gridCellB) {
    const minX = Math.min(gridCellA[0], gridCellB[0]);
    const minY = Math.min(gridCellA[1], gridCellB[1]);
    const maxX = Math.max(gridCellA[0], gridCellB[0]);
    const maxY = Math.max(gridCellA[1], gridCellB[1]);
    return minX <= cellCoords[0] && cellCoords[0] <= maxX
        && minY <= cellCoords[1] && cellCoords[1] <= maxY;
}

//-------------------------------------------------------------------
// HEX GRID DEFINITIONS
//-------------------------------------------------------------------

// // ratio between the side of a square and a hexagon of equal area
// const SQUARE_TO_HEX_SIDE_RATIO = 1.611854898;

// const HEX_SCALES = (function () {
//     const hex = {};
//     Object.getOwnPropertyNames(SQUARE_SCALES).forEach(scale => {
//         hex[scale] = parseFloat((SQUARE_SCALES[scale] / SQUARE_TO_HEX_SIDE_RATIO).toFixed(7));
//     });
//     return hex;
// })();

// const geodesicToHex = function (geoCoords, gridSize) {
//     //FIXME
// };

// const hexCellCenterToGeodesic = function (gridCoords, gridSize) {
//     //FIXME
// };

// const geodesicPointsToHexLimits = function (geoPointA, geoPointB, gridSize) {
//     //FIXME
// };

//-------------------------------------------------------------------
// EXPORT
//-------------------------------------------------------------------

module.exports = {
    SCALES: SQUARE_SCALES,
    // XXX: these MUST be regular functions, AND without external dependencies,
    // so they can be injected into couch views
    geoToGrid: geodesicToSquareCell,
    gridToGeoCenter: squareCellCenterToGeodesic,
    geoCornersToCells: geodesicPointsToSquareCellArea,
    cellIsInGridArea: isCellInSquareGridArea,
};
