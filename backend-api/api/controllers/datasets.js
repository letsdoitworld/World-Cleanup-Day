'use strict';

module.exports = {
    getManyDatasets: function (req, res, next) {
        return next();
    },

    getOneDataset: (req, res, next) => {
        next();
    },
};