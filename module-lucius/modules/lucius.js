'use strict';
const util = require('module-util');
const {Message, Responder} = require('../message');
const Connector = require('./connector');
const {isAsyncFunction} = require('./util');
const {LuciusError} = require('../error');
const logger = require('module-logger');
const logFormat = logger.formatter('SENECA');

class Lucius {
    constructor(seneca) {
        this.promisifiedAct = util.promise.promisify(seneca.act, seneca);
        this.seneca = seneca;
    }

    /**
     * Create a message in internal format.
     * @param {Message|any} [message=null] Optionally provide an existing message.
     *   Will create an empty message (successful by default) if this is missing.
     * @returns {Message}
     * @memberof Lucius
     */
    makeMessage(message = null) {
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
    getFatalError(e) {
        // unpack seneca errors
        if (e instanceof Error && e.seneca && e.orig) {
            const n = new Error(e.orig.message);
            n.code = e.orig.code;
            n.stack = e.stack;
            n.name = e.name;
            return n;
        }
        return e;
    }

    /**
     * This wraps seneca.act() in an async version, and wraps the response inside
     * an instance of Message, allowing you to deal with it via standard methods.
     * @memberof Lucius
     */
    async request(...params) {
        logger.debug(...logFormat('SEND', params[0], params[1]));
        const response = await this.promisifiedAct.apply(this.seneca, params);
        logger.debug(...logFormat('RECV', params[0], params[1], response));
        return this.makeMessage(response);
    }

    /**
     * This is a version of seneca.add() which requires an async callback
     * with the signature (args, responder), where responder is an instance
     * of Responder which can be used to return standardized payloads and
     * will also call next() for you.
     * @memberof Lucius
     */
    register(...params) {
        const pattern = params[0];
        logger.debug(...logFormat('REGISTER', pattern));
        // we separate the user-issued callback from the other params
        const customCallback = params.pop();
        // we require it to be async, to facilitate the use of await inside it
        if (!isAsyncFunction(customCallback)) {
            throw new TypeError('Callback was not declared async.');
        }
        // we fabricate a callback which observes the signature that seneca expects
        const wrapperCallback = (async function (args, next) {
            try {
                logger.debug(...logFormat('ENTER', pattern, args));
                // split out special arguments
                const __ = args.__ || {};
                delete args.__;
                // we prepare a Responder object that will help produce standard payloads
                const responder = new Responder(this.makeMessage);
                // ...and also a Connector object which can chain logical actions
                // and provides helper functions that reduce boilerplate code
                const connector = new Connector(responder, this);
                // we actually delegate the job to the custom callback
                const result = await customCallback.apply(this.seneca, [connector, args, __]);
                if (!(result instanceof Connector)) {
                    throw new TypeError(`Lucius handlers must return Connector, '${typeof result}' received`);
                }
                const message = await result.run();
                // analyze the resulted message for logging purposes
                if (message.isSuccessful()) {
                    logger.debug(...logFormat('RESP', pattern, args, message.getPayload()));
                } else {
                    logger.debug(...logFormat('ERROR', pattern, args, `${message.getErrors().length} error(s)`));
                    message.getErrors().forEach(e => {
                        logger.error(...logFormat('\error', pattern, args, e));
                    });
                }
                // export the message content to seneca
                return next(null, message.export());
            } catch (e) {
                // normally, e should be an instance of our standard error, but in practice
                // it could be any error, or even a scalar, so we need to sanity check it
                if (!(e instanceof LuciusError)) {
                    // seneca wraps foreign errors into its own, and keeps the original
                    // under property .orig; we try to detect if we're dealing with such
                    // nested errors and dig to uncover the original one
                    //FIXME: this is undocumented behavior and could break upstream
                    e = this.getFatalError(e);
                    // what we're left with could, once again, be anything;
                    // but we MUST make it into an Error object, because that's
                    // the magic value that tells seneca there's been a fatal error
                    if (!(e instanceof Error)) {
                        const oldCode = e && e.hasOwnProperty('code') ? e.code : 'UNKNOWN CODE';
                        const oldMessage = e && e.hasOwnProperty('message') ? e.message : 'UNKNOWN MESSAGE';
                        e = new Error(oldMessage);
                        e.code = oldCode;
                    }
                }
                logger.fatal(...logFormat('CRASH', pattern, args, e));
                return next(e);
            }
        }).bind(this);
        // we place the wrapper callback back among the parameters and call add()
        params.push(wrapperCallback);
        return this.seneca.add.apply(this.seneca, params);
    }

    /**
     * Registers to the seneca init:plugin_name pattern with a standard function that
     * logs some messages and lets you run a custom callback.
     * @param {string} pluginName The name of the plugin. It must match the plugin you call from,
     *   otherwise the code won't execute.
     * @param {function} [customCallback] Optionally provide a callback that will receive
     *   the ready function and the plugin name and can control when the plugin is ready by
     *   calling that function.
     * @memberof Lucius
     */
    pluginInit(pluginName, customCallback = undefined) {
        const seneca = this.seneca;
        seneca.add(`init:${pluginName}`, function (args, next) {
            const ready = (...params) => {
                logger.debug(...logFormat('PLUGIN', pluginName, args));
                if (!params.length) {
                    logger.info(...logFormat('PLUGIN', pluginName, 'ready'));
                } else {
                    logger.error(...logFormat('PLUGIN', pluginName, 'failed', params[0]));
                }
                next.apply(seneca, params);
            };
            if (customCallback && typeof customCallback === 'function') {
                return customCallback.apply(this, [ready, pluginName]);
            }
            return ready();
        });
    }
}

module.exports = Lucius;
