'use strict';
const logger = require('module-logger');
const util = require('module-util');
const fs = require('fs');
const path = require('path');
const caught = require('caught');
const cache = require('./cache');

const turfInside = require('@turf/inside');
const turfBbox = require('@turf/bbox');

const AREA_STORE = {};
const AREA_BBOX = {};
let AREA_CODES_REVERSE_SORTED = [];
const readdir = util.promise.promisify(fs.readdir, fs);
const readFile = util.promise.promisify(fs.readFile, fs);
const SEED_DIR = path.resolve(path.join(__dirname, 'seed'));

const makeGeojsonPointGeometry = (longitude, latitude) => ({
    type: 'Point',
    coordinates: [longitude, latitude],
});

const makeGeojsonFeature = geometry => ({
    type: 'Feature',
    properties: {},
    geometry,
});

const areaExists = code => AREA_STORE.hasOwnProperty(code);

const isPointInBbox = (longitude, latitude, bbox) => {
    return bbox[0] <= longitude && longitude <= bbox[2]
        && bbox[1] <= latitude && latitude <= bbox[3];
}

const isPointInPolygon = (longitude, latitude, areaCode) => {
    if (!areaExists(areaCode)) {
        throw new Error(`No such area: '${areaCode}'.`)
    }
    if (!isPointInBbox(longitude, latitude, AREA_BBOX[areaCode])) {
        return false;
    }
    return turfInside(
        makeGeojsonFeature(makeGeojsonPointGeometry(longitude, latitude)),
        AREA_STORE[areaCode].feature
    );
};

const init = async () => {
    logger.info('Geo: memory was', util.number.humanizeNumbers(process.memoryUsage()));
    return caught(new Promise(async resolve => {
        for (let fileName of await readdir(SEED_DIR)) {
            try {
                if (!/^[A-Z.]+\.json$/.test(fileName)) {
                    continue;
                }
                const doc = JSON.parse(
                    await readFile(path.resolve(path.join(__dirname, 'seed', fileName)), 'utf8')
                );
                if (!doc || !doc.code || !doc.name || !doc.geometry) {
                    logger.warning(`Skipping file '${fileName}', incorrect data properties.`)
                }
                doc.feature = makeGeojsonFeature(doc.geometry);
                delete doc.geometry;
                AREA_STORE[doc.code] = doc;
                AREA_CODES_REVERSE_SORTED.push(doc.code);
                AREA_BBOX[doc.code] = turfBbox(doc.feature);
                logger.debug(`Geo: loaded area '${doc.code}'.`);
            } catch (e) {
                logger.error(`Geo: failed to load area from file ${fileName}:`, e);
            }
        }
        AREA_CODES_REVERSE_SORTED = (AREA_CODES_REVERSE_SORTED.sort()).reverse();
        logger.info('Geo: in-memory store has been populated.');
        logger.info('Geo: memory now', util.number.humanizeNumbers(process.memoryUsage()));
        resolve();
    }));
};

const Memory = module.exports = {
    READY: init(),
    getAllAreasMetadata: () => {
        return Memory.READY.then(() => {
            return Object.getOwnPropertyNames(AREA_STORE).map(code => ({
                code,
                name: AREA_STORE[code].name,
                parent: AREA_STORE[code].parent || undefined,
            }));
        });
    },
    getAreasForLocation: (longitude, latitude) => {
        return Memory.READY.then(() => {
            const inAreas = {};
            for (let areaCode of AREA_CODES_REVERSE_SORTED) {
                if (inAreas[areaCode]) {
                    continue;
                }
                const cached = cache.search(longitude, latitude);
                if (cached) {
                    return cached;
                }
                if (isPointInPolygon(longitude, latitude, areaCode)) {
                    // mark as found in area code as well as all its parents
                    areaCode.split('.').reduce((prefix, codeBit) => {
                        inAreas[prefix + codeBit] = true;
                        return prefix + codeBit + '.';
                    }, '');
                    break;
                }
            }
            const result = Object.getOwnPropertyNames(inAreas);
            cache.save(longitude, latitude, result);
            return result;
        });
    },
};
