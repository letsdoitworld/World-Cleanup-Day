'use strict';

//-------------------------------------------------------------------
// GENERATE SQUARE SCALES
//-------------------------------------------------------------------
const SQUARE_SCALES = (() => {
    const scales = {};
    const minRes = 0.00003165120288457081; // geodetic degrees
    const maxRes = 33.04687231063843; // geodetic degrees
    const logMin = Math.log2(minRes);
    const logMax = Math.log2(maxRes);
    const steps = 100;
    const logStep = (logMax - logMin) / (steps - 1);
    for (let i = 0; i < steps; i++) {
        scales['S' + i] = Math.pow(2, logMin + logStep * i);
    }
    return scales;
})();

//-------------------------------------------------------------------
// SQUARE GRID DEFINITIONS
//-------------------------------------------------------------------

const getScaleForSquareCellSize = function (geodesicCellSide) {
    return Object.getOwnPropertyNames(SQUARE_SCALES).reduce((prevScale, currScale) => {
        if (geodesicCellSide > SQUARE_SCALES[currScale]) {
            if (prevScale) {
                if (SQUARE_SCALES[currScale] > SQUARE_SCALES[prevScale]) {
                    return currScale;
                }
                else {
                    return prevScale;
                }
            }
            else {
                return currScale;
            }
        }
        else {
            return prevScale;
        }
    }, 'S0');
};

const geodesicToSquareCell = function (geoPoint, gridSize) {
    return [
        parseInt(Math.floor(geoPoint[0] / gridSize)),
        parseInt(Math.floor(geoPoint[1] / gridSize)),
    ];
};

const squareCellCenterToGeodesic = function (geoPoint, gridSize) {
    return [
        (geoPoint[0] + 0.5) * gridSize,
        (geoPoint[1] + 0.5) * gridSize,
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

const isCellInSquareGridArea = function (geoPoint, gridCellA, gridCellB) {
    const minX = Math.min(gridCellA[0], gridCellB[0]);
    const minY = Math.min(gridCellA[1], gridCellB[1]);
    const maxX = Math.max(gridCellA[0], gridCellB[0]);
    const maxY = Math.max(gridCellA[1], gridCellB[1]);
    return minX <= geoPoint[0] && geoPoint[0] <= maxX
        && minY <= geoPoint[1] && geoPoint[1] <= maxY;
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
    getScaleForCellSize: getScaleForSquareCellSize,
};
