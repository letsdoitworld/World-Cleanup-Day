'use strict';
const {Lucius} = require('module-lucius');

module.exports = {
    authorizeWithExternal: function (req, res, next) {
        return Lucius.connectHandle(
            req, res, next,
            'role:auth,cmd:authorizeWithExternal',
            req.swagger.params.credentials.value
        );
    },
};
