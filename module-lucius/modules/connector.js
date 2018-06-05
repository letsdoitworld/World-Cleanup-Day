'use strict';
const {isAsyncFunction} = require('./util');
const {Message} = require('../message');

class Connector {
    constructor(responder, lucius, userInfo) {
        this.responder = responder;
        this.lucius = lucius;
        this.userInfo = userInfo;
        this.calls = [];
        this.store = {};
    }

    /**
     * Adds a middleware that will empty the temporary internal value store of this chain.
     * @returns Connector The chain object, for method chaining.
     * @memberof Connector
     */
    reset() {
        this.use(async function (input, responder) {
            this.store = {};
            return responder.success(input);
        });
        return this;
    }

    /**
     * Adds a middleware that will store the current chain input in the internal value store
     * with the indicated key. The chain input will be passed on unaffected.
     * @param {string} key A name under which the value will be stored.
     * @returns Connector The chain object, for method chaining.
     * @memberof Connector
     */
    set(key) {
        if (typeof key !== 'string') {
            throw TypeError('Parameter must be of type string.')
        }
        this.use(async function (input, responder) {
            this.store[key] = input;
            return responder.success(input);
        });
        return this;
    }

    /**
     * Adds a middleware that replaces the chain input with a set of values retrieved from the internal
     * chain store. The input will be an object where each property will be a store value.
     * @param {string|string[]} keys String or array of string that indicate the store values to be retrieved.
     * @returns Connector The chain object, for method chaining.
     * @memberof Connector
     */
    get(keys) {
        if (typeof keys === 'string') {
            keys = [keys];
        }
        if (!Array.isArray(keys)) {
            throw TypeError('Parameter must be string or array of strings.')
        }
        keys.forEach((value, index) => {
            if (typeof value !== 'string') {
                throw TypeError(`Parameter array must be string or array of strings. Entry at index ${index} is not string.`);
            }
        });
        this.use(async function (input, responder) {
            const response = {};
            keys.forEach(value => {
                if (this.store.hasOwnProperty(value)) {
                    response[value] = this.store[value];
                } else {
                    response[value] = null;
                }
            });
            return responder.success(response);
        });
        return this;
    }

    /**
     * Adds a middleware that will process an input, do a job, and return a response.
     * @param {function} f Async function that will be called with an input value coming
     *   from the previous middleware in the chain, and a Responder object which can be
     *   used to create valid responses. The return value MUST be a responder.success()
     *   or responder.error(). An error will stop the chain with the error value. A
     *   success response will be passed as input to the next middleware in the chain.
     *   If the chain ends with success, the value is used as microservice response.
     *   Fatal errors MUST be thrown as exceptions.
     * @returns Connector The chain object, for method chaining.
     * @memberof Connector
     */
    use(f) {
        if (!isAsyncFunction(f)) {
            throw TypeError('Callback was not declared async.');
        }
        this.calls.push(f);
        return this;
    }

    /**
     * Adds a middleware that overwrites the input value for the next one.
     * @param {function|any} args If this is a function, it will be applied to the current input,
     *   and the return value will become the new input value. If anything else, it will overwrite
     *   the input value.
     * @returns Connector The chain object, for method chaining.
     * @memberof Connector
     */
    input(args) {
        this.use(async function (input, responder) {
            let output;
            if (typeof args === 'function') {
                output = args(input);
            } else {
                output = args;
            }
            return responder.success(output);
        });
        return this;
    }

    /**
     * Adds a middleware that acts like its own Connector chain.
     * @param {function} f Function that receives a fresh connector and the input from the
     *   previous entry in the master chain and must return a Connector.
     * @returns Connector The chain object, for method chaining.
     * @memberof Connector
     */
    connect(f) {
        if (!isAsyncFunction(f)) {
            throw TypeError('Callback was not declared async.');
        }
        this.use(async function (input, responder) {
            const connector = new Connector(responder, this.lucius);
            const retConnector = await f(connector, input);
            if (!(retConnector instanceof Connector)) {
                throw new TypeError(`The callback must return Connector, '${typeof result}' received`);
            }
            return retConnector.run();
        }.bind(this));
        return this;
    }

    /**
     * Add a middleware that makes sequential requests to a Seneca pattern using
     * entries in an array as parameters.
     * @param {string} pattern Addressing pattern for the microservice endpoint.
     * @param {array|function|undefined|any} args If undefined, the chain input will
     * be used instead, and a single request will be made (basically the same as
     * using request().) If the parameter is a function, it will be applied to
     * the chain input and its result will be used instead. The response is
     * returned (as the chain input) also as an array, where each entry contains
     * one response. If any of the requests results in an error, the error
     * response is returned immediately and directly (ie. not inside an array),
     * without performing the rest of the requests.
     * @returns Connector The chain object, for method chaining.
     * @memberof Connector
     */
    multiRequest(pattern, args) {
        this.use(async function (input, responder) {
            let params;
            if (typeof args === 'undefined') {
                params = input;
            } else if (typeof args === 'function') {
                params = args(input);
            } else {
                params = args;
            }
            if (!Array.isArray(params)) {
                params = [params];
            }
            const results = [];
            for (let i = 0; i < params.length; i++) {
                let ret = await this.lucius.request(pattern, params[i], this.userInfo);
                if (!ret.isSuccessful()) {
                    return ret;
                }
                results.push(ret.getPayload());
            }
            return responder.success(results);
        }.bind(this));
        return this;
    }

    /**
     * Adds a middleware that will perform a microservice request and handle the result for you.
     * The payload from success responses will be available as input for the next middleware.
     * @param {string} pattern Addressing pattern for the microservice endpoint.
     * @param {undefined|function|any} [args] Parameters to be passed to the microservice call.
     *   If missing, it will use the input from the previous middleware. If it's a function, it
     *   will be applied to the input and the return value used instead. If anything else, it
     *   will be used instead of the input.
     * @returns Connector The chain object, for method chaining.
     * @memberof Connector
     */
    request(pattern, args) {
        this.use(async function (input) {
            let params;
            if (typeof args === 'undefined') {
                params = input;
            } else if (typeof args === 'function') {
                params = args(input);
            } else {
                params = args;
            }
            return await this.lucius.request(pattern, params, this.userInfo);
        }.bind(this));
        return this;
    }

    /**
     * Runs all the middlewares in the order they were added and examines their return values
     * for error or success. An error stops the chain immediately, while a success value is
     * passed to the next middleware as input, or returned if the chain has ended.
     * Please note that Message objects are expected to be returned from middlewares and are
     * returned by this function, but middlewares receive as input the Message payload (ie.
     * not Message instances).
     * @returns Message
     * @memberof Connector
     */
    async run() {
        let message = this.responder.success();
        for (let i = 0; i < this.calls.length; i++) {
            const cb = this.calls[i];
            let response = await cb.apply(this,
                [message.getPayload(), this.responder]);
            if (response instanceof Connector) {
                response = response.run();
            }
            if (!(response instanceof Message)) {
                throw new TypeError(`Connector middlewares must return Message, '${typeof result}' received`);
            }
            if (!response.isSuccessful()) {
                return response;
            }
            message = response;
        }
        return message;
    }
}

module.exports = Connector;
