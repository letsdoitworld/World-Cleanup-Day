'use strict';
const {Lucius} = require('module-lucius');
const util = require('module-util');

/**
 * Middleware handler that performs a Seneca request and sets the response accordingly.
 * @param {object} req Connect request object.
 * @param {object} res Connect response object.
 * @param {function} next Connect callback function.
 * @param {string} pattern Seneca message pattern.
 * @param {object|function} params Seneca message parameters. Either object,
 *   or a function that will receive req and will return a parameter object.
 * @param {function} [cbSuccess=null] Optionally provide a function that
 *   will receive req, res and a Seneca successful response payload and will
 *   be expected to set the connect response and body. The default function
 *   sets status 200 and the body to the payload.
 */
const handler = async function (req, res, next, pattern, params, cbSuccess = null) {
    // if params is a function, run it
    if (typeof params === 'function') {
        params = params(req);
    }
    // make sure params is never undefined
    params = params || {};
    // selectively add extra info to params.__
    params.__ = util.object.filter(req.__, {user: true, session: true});
    // make the seneca request
    const lucius = new Lucius(req.__.seneca);
    try {
        const response = await lucius.request(pattern, params);
        if (!response.isSuccessful()) {
            // business logic errors are signalled with 400
            res.status(400);
            return next(response.getErrors());
        }
        // business logic success
        res.status(200);
        if (cbSuccess) {
            return cbSuccess(res, response.getPayload());
        }
        return res.json(response.getPayload());
    } catch (e) {
        // fatal errors are signalled with 500
        res.status(500);
        return next(lucius.getFatalError(e));
    }
};

/**
 * Call this to get a middleware customized to perform a Seneca request
 * with the indicated pattern and parameters.
 * @param {string} pattern Seneca message pattern.
 * @param {object|function} params Seneca message parameters. Either object,
 *   or a function that will receive req and will return a parameter object.
 * @param {function} [cbSuccess=null] Optionally provide a function that
 *   will receive res and the Seneca successful response payload and will
 *   be expected to set the connect response and body. The default function
 *   sets status 200 and body = payload.
 * @returns Middleware that performs the indicated Seneca request and uses
 *   the result to set response status and body.
 */
module.exports = function (pattern, params, cbSuccess = null) {
    // XXX: need to wrap our async func in a normal func
    // because swagger-tools uses ancient lodash-compat
    // which doesn't recognize async as functions
    return function (req, res, next) {
        return handler(req, res, next, pattern, params, cbSuccess);
    };
};
