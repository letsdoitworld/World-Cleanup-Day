'use strict';

module.exports = {
    isAsyncFunction: f => {
        if (typeof f !== 'function') {
            return false;
        }
        const asyncProto = Object.getPrototypeOf(async function () {});
        const proto = Object.getPrototypeOf(f);
        return proto === asyncProto;
    },
};
