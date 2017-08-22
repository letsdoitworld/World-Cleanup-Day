'use strict';
const {LuciusError, LUCIUS_ERROR_MARKER} = require('../error');

/**
 * Helper functions that simplify the packing and delivery of a microservice message,
 * or examine the state of a received microservice message, or retrieve its content.
 *
 * @param {callback} makeMessage Function that creates a Message object and optionally use an existing payload.
 */
const Responder = function (makeMessage) {

    /**
     * Deliver a successful microservice message with a certain payload.
     *
     * @param {?any} [payload=null] Optionally provide arbitrary data that will be packed in the message.
     * @returns {Message} A Message object with successful state.
     */
    this.success = (payload = null) => {
        return makeMessage().setPayload(payload);
    };

    /**
     * Deliver a message containing business logic errors.
     *
     * @param {LuciusError|LuciusError[]} errorSet A single error or an array of errors.
     * @returns {Message} A Message object with error state.
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
            e.marker = LUCIUS_ERROR_MARKER;
            M.setError(e);
        });
        return M;
    };

};

module.exports = {Responder};
