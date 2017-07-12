'use strict';
const Bluebird = require('bluebird');
const {E, LuciusError} = require('./error');
const {Message, Responder} = require('./message');
const logger = require('module-logger');

const ConnectErrors = function (prefix = null, capitalizeCodes = false) {
    this.errors = [];
    this.add = (code, message) => {
        if (prefix) code = prefix + code;
        if (capitalizeCodes) code = code.toUpperCase();
        this.errors.push({code, message});
        return this;
    }
    this.export = () => this.errors;
}

class Lucius {
    constructor (seneca) {
        this.seneca = seneca;

        this.promisifiedAct = Bluebird.promisify(seneca.act, {context: seneca});

        // make static methods available on instances too
        this.makeMessage = this.constructor.makeMessage;
        this.getFatalError = this.constructor.getFatalError;
    }

    static isAsyncFunction(f) {
        if (typeof f !== 'function') {
            return false;
        }
        const asyncProto = Object.getPrototypeOf(async function () {});
        const proto = Object.getPrototypeOf(f);
        return (proto === asyncProto);
    }

    static makeMessage(message = null) {
        if (message && message instanceof Message) {
            return message;
        }
        return new Message(message);
    }

    /**
     * This can be used to dig in a Seneca error for the original one.
     * (Seneca wraps the original errors in its own.)
     * @static
     * @param {any} e 
     * @returns {any}
     * @memberof Lucius
     */
    static getFatalError(e) {
        while (e && e.hasOwnProperty('orig') && e.orig) {
            e = e.orig;
        }
        return e;
    }

    /**
     * This wraps seneca.act() in an async version, and wraps the response inside
     * an instance of Message, allowing you to deal with it via standard methods.
     */
    async act(...params) {
        logger.debug(`SENECA: Calling ${params[0]} with args ${JSON.stringify(params[1])}.`);
        const response = await this.promisifiedAct.apply(this.seneca, params);
        return this.makeMessage(response);
    }

    /**
     * This is a version of seneca.add() which requires an async callback
     * with the signature (args, responder), where responder is an instance
     * of Responder which can be used to return standardized payloads and
     * will also call next() for you.
     */
    add(...params) {
        logger.debug(`SENECA: Registered ${params[0]}.`);
        // we separate the user-issued callback from the other params
        const customCallback = params.pop();
        // we require it to be async, to facilitate the use of await inside it
        if (!(this.constructor.isAsyncFunction(customCallback))) {
            throw new TypeError('Callback was not declared async.');
        }
        // we fabricate a callback which observes the signature that seneca expects
        const wrapperCallback = (args, next) => {
            // we actually delegate the job to the user callback, to whom we provide
            // a Responder object that will help them produce standard payloads
            const responder = new Responder(
                next, this.makeMessage, this.getFatalError, params[0]);
            return customCallback.apply(this.seneca, [args, responder]);
        };
        // we place the wrapper callback back among the parameters and call add()
        params.push(wrapperCallback);
        return this.seneca.add.apply(this.seneca, params);
    }

    pluginInit (pluginName, customCallback = null) {
        this.add(`init:${pluginName}`, async function (args, responder) {
            logger.info(`SENECA: plugin "${pluginName}" was initialized.`);
            logger.debug(`SENECA: plugin "${pluginName}" options:`, args);
            if (customCallback && typeof customCallback === 'function') {
                customCallback.apply(this, [pluginName]);
            }
            responder.next();
        });
    }

    static connectErrors(...params) {
        var obj = Object.create(ConnectErrors.prototype);
        ConnectErrors.apply(obj, params);
        return obj;
    }

    static async connectHandle(
        req, res, next,
        pattern, params,
        cbSuccess = null, cbFailure = null, cbError = null
    ) {
        if (!cbSuccess) cbSuccess = payload => res.status(200).json(payload);
        if (!cbFailure) cbFailure = response => res.status(400).json(response.getErrors());
        if (!cbError) cbError = err => res.status(500).json([{code: err.code, message: err.message}]);

        try {
            const lucius = new Lucius(req.seneca);
            const response = await lucius.act(pattern, params);
            if (!response.isSuccessful()) {
                response.getErrors().forEach(
                    e => logger.error(`SENECA: ${e.code}: ${e.message}`)
                );
                return cbFailure(response);
            }
            return cbSuccess(response.getPayload());
        } catch (e) {
            const err = Lucius.getFatalError(e);
            logger.critical(`SENECA: ${err.code}: ${err.message}`);
            logger.debug('SENECA:', err);
            return cbError(err);
        }
    }
};

module.exports = {
    E,
    LuciusError,
    Lucius,
};
