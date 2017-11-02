'use strict';
const senecaRequestMw = require('../../modules/swagger-setup/middleware/seneca');

module.exports = {
    getCountTeamTrashpoints: senecaRequestMw(
        'role:db,cmd:getCountTeamTrashpoints',
    ),
    getTeamTrashpoint: senecaRequestMw(
        'role:db,cmd:getTeamTrashpoint',
        req => ({
            id: req.swagger.params.id.value,
        }),
    )
};
