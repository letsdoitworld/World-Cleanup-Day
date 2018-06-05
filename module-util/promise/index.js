'use strict';

module.exports = {
    promisify: (f, context) => {
        return (...params) => {
            return new Promise((resolve, reject) => {
                params.push((err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(res);
                });
                f.apply(context, params);
            });
        };
    },
};
