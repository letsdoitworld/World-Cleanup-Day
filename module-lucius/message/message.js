/**
 * This module defines the format of the messages passed between microservices
 * as well as an object that is used to populate and examine the messages.
 *
 * Please note that you will most likely not have to deal with either of them,
 * ever, in your code, since a different module (helper.js) offers methods
 * that will deal with them so you don't have to.
 *
 * However, if you have to modify this module, it is important to distinguish
 * between the actual raw messages (type MessageContent) and the object
 * being used to represent and manipulate them (class Message).
 */
'use strict';

/**
 * @typedef ErrorEntry
 * @type {object}
 * @property {string} message - Succint message describing the error for developers.
 * @property {string} code - Machine-readable code used to identify the error.
 * @property {string} __marker - Marker used for internal purposes.
 */

/**
 * @typedef MessageContent
 * @type {object}
 * @property {boolean} success - Indicates the message success state. Defaults to true.
 * @property {ErrorEntry[]} errors - Array of error objects.
 * @property {any} payload - Arbitrary data load.
 */

/**
 * Object that contains and manipulates one microservice message.
 *
 * @param {?MessageContent} [overwrite=null] Can be optionally initialized with an pre-existing content.
 */
const Message = function (overwrite = null) {
    /**
     * Establish the data structure of a message.
     * @type {MessageContent}
     */
    const content = {
        success: true,
        errors: [],
        payload: null,
    };

    /**
     * Overwrites the entire payload with the given value.
     *
     * @param {?any} [payload=null] Arbitrary value.
     *   If omitted, it will erase the current payload.
     * @returns {Message} Self-reference, for method chaining.
     */
    this.setPayload = (payload = null) => {
        content.payload = payload;
        return this;
    };

    /**
     * Retrieve the current payload of the message.
     *
     * @returns {any} The payload inside the message content, or the value of a specific entry.
     */
    this.getPayload = () => content.payload;

    /**
     * Retrieve the current errors in the message.
     *
     * @returns {ErrorEntry[]} errors - Array of error objects.
     */
    this.getErrors = () => content.errors;

    /**
     * Adds an error to the message and sets the message state to be unsuccessful.
     *
     * @param {ErrorEntry} error An error definition.
     * @returns {Message} Self-reference, for method chaining.
     */
    this.setError = ({message, code, marker}) => {
        if (typeof message !== 'string') {
            throw new TypeError('Parameter "message" must be string.');
        }
        if (typeof code !== 'string') {
            throw new TypeError('Parameter "code" must be string.');
        }
        content.success = false;
        content.errors.push({message, code, marker});
        return this;
    };

    /**
     * Delete all the errors in the message content.
     */
    const clearAllErrors = () => {
        content.errors = [];
    };

    /**
     * Overwrite all errors in the message content.
     *
     * @param {ErrorEntry[]} errors Array of errors.
     */
    this.setAllErrors = errors => {
        if (!Array.isArray(errors)) {
            throw new TypeError('Received parameter must be array.')
        }
        clearAllErrors();
        for (let i = 0; i < errors.length; i++) {
            this.setError(errors[i]);
        }
    };

    /**
     * Forces the state of the message to be successful.
     * This will clear all the errors inside the message, but not the payload.
     *
     * @returns {Message} Self-reference, for method chaining.
     */
    this.setSuccess = () => {
        content.success = true;
        clearAllErrors();
        return this;
    };

    /**
     * Retrieves the content of the message.
     *
     * @returns {MessageContent} The content.
     */
    this.export = () => content;

    /**
     * Reports whether the current state of the message is successful.
     *
     * @returns {boolean} True if successful.
     */
    this.isSuccessful = () => !!content.success;

    /**
     * Checks whether the message contains a error with the given code.
     *
     * @param {string} code An error registry code.
     * @returns {boolean} True if there's at least one error with that code.
     */
    this.containsError = code => {
        for (let i = 0; i < content.errors.length; i++) {
            if (content.errors[i].code === code) {
                return true;
            }
        }
        return false;
    };

    // overwrite the content, if applicable
    if (overwrite) {
        if (overwrite.hasOwnProperty('success')) {
            content.success = !!overwrite.success;
        }
        if (!content.success && overwrite.hasOwnProperty('errors')) {
            this.setAllErrors(overwrite.errors);
        }
        if (overwrite.hasOwnProperty('payload')) {
            this.setPayload(overwrite.payload);
        }
    }
};

module.exports = {Message};
