'use strict';
const {LuciusError} = require('../error');
const {Message} = require('./message');
const logger = require('module-logger');

/**
 * Helper functions that simplify the packing and delivery of a microservice message,
 * or examine the state of a received microservice message, or retrieve its content.
 *
 * @param {callback} next Provide the callback from a seneca.add() handler.
 * @param {callback} makeMessage Function that creates a Message object and optionally use an existing payload.
 * @param {callback} getFatalError Function that extracts exceptions wrapped in Seneca error responses.
 * @param {string} pattern The pattern for the handler where this responder was used.
 */
const Responder = function (next, makeMessage, getFatalError, pattern) {

    // Make next() available on this object.
    this.next = next;

    /**
     * Deliver a successful microservice message with a certain payload.
     *
     * @param {?any} [payload=null] Optionally provide arbitrary data that will be packed in the message.
     * @returns {any} The callback output.
     */
    this.success = (payload = null) => {
        logger.debug(`SENECA: Respond success to ${pattern} with payload ${payload}`);
        return next(null, makeMessage().setPayload(payload).export());
    };
    /**
     * Deliver a microservice message as-is, without altering it in any way.
     * Useful for passing messages unaltered from one service to another.
     *
     * @param {Message|MessageContent} message The message to be passed on.
     * @returns {any} The callback output.
     */
    this.same = message => {
        logger.debug(`SENECA: Respond passthru for ${pattern} with message ${message}`);
        return next(null, makeMessage(message).export());
    }

    /**
     * Deliver a message containing business logic errors.
     *
     * @param {LuciusError|LuciusError[]} errorSet A single error or an array of errors.
     * @returns {any} The callback output.
     */
    this.failure = (errorSet) => {
        if (!Array.isArray(errorSet)) {
            errorSet = [errorSet];
        }
        errorSet.map((value, index) => {
            if (!(value instanceof LuciusError)) {
                throw new TypeError(`Error at index ${index} must be instance of LuciusError`);
            }
        });

        const M = makeMessage();
        errorSet.forEach(e => {
            M.setError(e);
            logger.error(`SENECA: ${e.code}: ${e.message}`);
            logger.debug('SENECA', e);
        }, this);
        return next(null, M.export());
    };

    /**
     * Delivers a microservice fatal error and encapsulates an exception into it.
     *
     * @param {Error} e An object that will be passed through the error to the caller service.
     * @returns {any} The callback output.
     */
    this.fatal = (e) => {
        // normally, e should be an instance of our standard error, but in practice
        // it could be any error, or even a scalar, so we need to sanity check it
        if (!(e instanceof LuciusError)) {
            // seneca wraps foreign errors into its own, and keeps the original
            // under property .orig; we try to detect if we're dealing with such
            // nested errors and dig to uncover the original one
            //FIXME: this is undocumented behavior and could break upstream
            e = getFatalError(e);
            // what we're left with could, once again, be anything;
            // but we MUST make it into an Error object, because that's
            // the magic value that tells seneca there's been a fatal error
            if (!(e instanceof Error)) {
                const oldCode = e && e.hasOwnProperty('code') ? e.code : 'UNKNOWN CODE';
                e = new Error(e && e.hasOwnProperty('message') ? e.message : 'UNKNOWN MESSAGE');
                e.code = oldCode;
            }
        }
        logger.critical(`SENECA: ${e.code}: ${e.message}`);
        logger.debug('SENECA', e);
        return next(e);
    };

};

module.exports = {Responder};
