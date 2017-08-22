'use strict';
const logger = require('module-logger');
const util = require('module-util');
const fs = require('fs');
const path = require('path');
const gju = require('geojson-utils');
const caught = require('caught');
const cache = require('./cache');

const AREA_STORE = {};
let AREA_CODES_REVERSE_SORTED = [];
const readdir = util.promise.promisify(fs.readdir, fs);
const readFile = util.promise.promisify(fs.readFile, fs);
const SEED_DIR = path.resolve(path.join(__dirname, 'seed'));

const makePointGeoJSON = (longitude, latitude) => ({
    type: 'Point',
    coordinates: [longitude, latitude],
});

const areaExists = code => AREA_STORE.hasOwnProperty(code);

const isPointInPolygon = (longitude, latitude, areaCode) => {
    if (!areaExists(areaCode)) {
        throw new Error(`No such area: '${areaCode}'.`)
    }
    return gju.pointInPolygon(
        makePointGeoJSON(longitude, latitude),
        AREA_STORE[areaCode].geometry
    );
};

const init = async () => {
    logger.info('Geo: memory was', util.number.humanizeNumbers(process.memoryUsage()));
    return caught(new Promise(async resolve => {
        for (let fileName of await readdir(SEED_DIR)) {
            const doc = JSON.parse(
                await readFile(path.resolve(path.join(__dirname, 'seed', fileName)), 'utf8')
            );
            if (!doc || !doc.code || !doc.name || !doc.geometry) {
                logger.warning(`Skipping file '${fileName}', incorrect data properties.`)
            }
            AREA_STORE[doc.code] = doc;
            AREA_CODES_REVERSE_SORTED.push(doc.code);
            logger.debug(`Geo: loaded area '${doc.code}'.`);
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
                    break;
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
                }
            }
            const result = Object.getOwnPropertyNames(inAreas);
            cache.save(longitude, latitude, result);
            return result;
        });
    },
};
