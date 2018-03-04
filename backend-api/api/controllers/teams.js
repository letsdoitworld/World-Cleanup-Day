'use strict';
const senecaRequestMw = require('../../modules/swagger-setup/middleware/seneca');

module.exports = {
    getAllTeams: senecaRequestMw(
        'role:db,cmd:getAllTeams',
    ),
    getCountTeamsTrashpoints: senecaRequestMw(
        'role:db,cmd:getCountTeamsTrashpoints',
    ),
    getTeam: senecaRequestMw(
        'role:db,cmd:getTeam',
        req => ({
            id: req.swagger.params.id.value,
        }),
    )
};
