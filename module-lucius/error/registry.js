'use strict';
const registry = require('./definitions');

for (let key in registry) {
    if (registry.hasOwnProperty(key)) {
        // perform sanity checks
        if (typeof registry[key].message !== 'function') {
            throw new TypeError(`Property 'message' for error ${key} is not a function.`);
        }
        if (typeof registry[key].message({}) !== 'string') {
            throw new TypeError(`Property 'message' for error ${key} is not returning string.`);
        }
        // copy the error key inside the definition,
        // so it can be retrieved programatically
        registry[key].code = key;
        // our marker
        registry[key].foo = 'bar';
    }
}

module.exports = registry;
