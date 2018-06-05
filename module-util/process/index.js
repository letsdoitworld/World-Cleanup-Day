'use strict';

module.exports = {
    /**
     * Looks up env vars whose names match the pattern "NAME2"
     * (prefix followed by integer) and returns them in a sparse array
     * using the integers as array indexes.
     * @param {any} prefix Leading string in the var name.
     * @param {boolean} [bashArray=false] Optionally use pattern "NAME[2]" instead.
     * @returns {string[]} Array of var values.
     */
    getEnvVarAsArray: (prefix, bashArray = false) => {
        const vars = [];
        const regexp = new RegExp(
            bashArray ? `^${prefix}\\[(\\d+)\\]$` : `^${prefix}(\\d+)$`
        );
        Object.getOwnPropertyNames(process.env).forEach(name => {
            const ret = regexp.exec(name);
            if (ret) {
                vars[parseInt(ret[1])] = process.env[name];
            }
        });
        return vars;
    },
    /**
     * Sets the process to die on any unhandled promise rejection, in order
     * to (1) log the error that caused it with full stack trace, and to
     * (2) prepare for a future version of Node where the default handler
     * for this event might kill our process anyway.
     */
    fatalUnhandledRejections: () => {
        process.on('unhandledRejection', e => {
            console.log('Unhandled promise rejection, will now abort:', e);
            process.exit(1);
        });
        /**
         * XXX: If you are creating promises which are caught asynchronously
         * (created in one place and caught in another) and want to avoid
         * tripping this event, make sure to add a catch() immediately
         * after you define the promise, but after it and separately from
         * the definition ie. not directly attach the catch to the promise.
         * Bad: var p = new Promise.reject(); // unhandled
         * Bad: var p = new Promise.reject().catch(()=>{}); // same as resolve(undefined)
         * Good: var p = new Promise.reject(); p.catch(()=>{}); // async catch
         *
         * When you attach a catch separately it counts as an asynchronously
         * handled rejection and because it occurs immediately after it won't
         * trip the unhandled rejection event at all. This also allows you
         * to catch the same promise multiple times in other places.
         *
         * When you attach a catch directly to the promise definition the
         * promise RESOLVES with 'undefined', and none of the other
         * asynchronous catches will fire, which is probably not what you want.
         *
         * Further details:
         * https://stackoverflow.com/questions/40920179/should-i-refrain-from-handling-promise-rejection-asynchronously
         *
         * The 'caught' NPM module will implement the good example for you
         * if you wrap your promise in it:
         * https://www.npmjs.com/package/caught
         */
    },
};
