'use strict';

const filterProps = (o, what, hardCheck = false) => {
    const n = {};
    for (let prop in o) {
        if (o.hasOwnProperty(prop)) {
            if (what.hasOwnProperty(prop)) {
                if (typeof what[prop] === 'object') {
                    n[prop] = filterProps(o[prop], what[prop]);
                } else {
                    n[prop] = o[prop];
                }
            }
            else if (hardCheck) {
                throw new Error(`Hard check is on, property '${prop}' is not present in whitemap.`);
            }
        }
    }
    return n;
};

module.exports = {
    filter: filterProps,
};
