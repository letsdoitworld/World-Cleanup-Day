'use strict';
const moment = require('moment');

const SESSION_EXPIRATION = process.env.SESSION_EXPIRATION;

const getNowUNIX = () => {
    return moment().utc().unix();
};

const convertDaysToSeconds = days => 60 * 60 * 24 * days;

const getExpirationIntervalInDays = () => {
    const expirationDays = parseInt(SESSION_EXPIRATION);
    if (expirationDays < 1) {
        throw new Error('Invalid SESSION_EXPIRATION value, must be 1 or greater.')
    }
    return expirationDays;
};

const getExpirationIntervalInSeconds = () => {
    return convertDaysToSeconds(getExpirationIntervalInDays());
};

const getNowUTC = (data) => data ? moment(data).toISOString() : moment().toISOString();

const getUTCDateShifted = (quantity, units) => moment().utc().add(quantity, units).toDate();
const getNowUTCShifted = (quantity, units) => moment().utc().add(quantity, units).toISOString();

module.exports = {
    getExpirationIntervalInDays,
    getExpirationIntervalInSeconds,
    getNowUNIX,
    getNowUTC,
    getUTCDateShifted,
    getNowUTCShifted,
    convertDaysToSeconds,
};
