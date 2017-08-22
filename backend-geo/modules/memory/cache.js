'use strict';
const logger = require('module-logger');

const CACHE_LIMIT = parseInt(process.env.CACHE_LIMIT || 5000);
const CACHE = {};
let CACHE_SIZE = 0;
const CACHE_LOG = [];
let CACHE_LOG_START = 0;
const CACHE_LOG_SPARSE = true;

const cacheDisabled = () => CACHE_LIMIT <= 0;

const manageSize = () => {
    if (CACHE_SIZE > CACHE_LIMIT) {
        CACHE_SIZE -= 1;

        let booted;
        if (CACHE_LOG_SPARSE) {
            // do LIFO with start index and sparse array
            booted = CACHE_LOG[CACHE_LOG_START];
            delete CACHE_LOG[CACHE_LOG_START];
            CACHE_LOG_START += 1;
        }
        else {
            // do LIFO with array shifting
            booted = CACHE_LOG.shift();
        }

        delete CACHE[booted[0]][booted[1]];
    }
};

if (cacheDisabled()) {
    logger.warning('Geo: search cache is not active!');
} else {
    logger.info(`Geo: search cache running with ${CACHE_LIMIT} sloths.`);
}

module.exports = {
    size: () => CACHE_SIZE,
    search: (longitude, latitude) => {
        if (cacheDisabled()) {
            return false;
        }
        if (CACHE[longitude] && CACHE[longitude][latitude]) {
            logger.debug(`Geo: cache hit for ${longitude} x ${latitude} with size ${CACHE_SIZE}.`);
            return CACHE[longitude][latitude];
        }
        return false;
    },
    save: (longitude, latitude, data) => {
        if (cacheDisabled()) {
            return false;
        }
        if (!CACHE[longitude]) {
            CACHE[longitude] = {};
        }
        CACHE[longitude][latitude] = data;
        CACHE_SIZE += 1;
        CACHE_LOG.push([longitude, latitude]);
        manageSize();
        return true;
    },
};
