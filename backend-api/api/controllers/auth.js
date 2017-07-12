'use strict';
const {Lucius} = require('module-lucius');

module.exports = {
    externalLogin: function (req, res, next) {
        return Lucius.connectHandle(
            req, res, next,
            'role:auth,cmd:externalLogin',
            req.swagger.params.credentials.value
        );
    },
};
