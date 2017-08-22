'use strict';
const logger = require('module-logger');
const {E, LuciusError, isLuciusError} = require('module-lucius');

const ConnectErrors = function (prefix = '', capitalizeCodes = false) {
    this.errors = [];
    this.add = (code, message) => {
        if (prefix && code) {
            code = prefix + code;
        }
        if (capitalizeCodes && code) {
            code = code.toUpperCase();
        }
        if (!code) {
            code = 'UNKNOWN';
        }
        this.errors.push({code, message});
        return this;
    }
    this.export = () => this.errors;
};

module.exports = (err, req, res, next) => {
    let connectErrors;
    // Deal with Swagger validation errors.
    if (err.failedValidation) {
        connectErrors = new ConnectErrors('SWAGGER_', true /* force uppercase codes */);
        connectErrors.add(err.code, err.message);

        logger.error(`SWAGGER: Parameter "${err.paramName}" failed validation:`, req.swagger.params[err.paramName]);
        logger.error(err.code, err.message);

        if (err.results && err.results.errors && Array.isArray(err.results.errors)) {
            err.results.errors.forEach(value => {
                connectErrors.add(value.code, value.message);
                logger.error(value.code, value.message);
            });
        }
        if (err.results && err.results.warnings && Array.isArray(err.results.warnings)) {
            err.results.warnings.forEach(value => {
                logger.warning(value.code, value.message);
            });
        }
    }
    else {
        connectErrors = new ConnectErrors('', true /* force uppercase codes */);
        if (!Array.isArray(err)) {
            err = [err];
        }
        let maskedOne = false;
        err.forEach(e => {
            logger.error(e);
            // mask the error if it doesn't look like one of ours,
            // because chances are it wasn't meant for API consumption
            if (!isLuciusError(e) && !e.swaggerSecurity) {
                if (!maskedOne) {
                    maskedOne = true;
                    const nE = new LuciusError(E.API_UNEXPECTED_ERROR);
                    connectErrors.add(nE.code, nE.message);
                    logger.warning(`Error ${e.code} was masked in the API response as API_UNEXPECTED_ERROR.`);
                }
            }
            else {
                connectErrors.add(e.code, e.message);
            }
        });
    }

    // force status 500 if another middleware hasn't already changed it
    if (res.statusCode + '' === '200') {
        res.status(500);
    }
    res.json(connectErrors.export());
};
