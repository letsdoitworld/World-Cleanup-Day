'use strict';
const senecaRequestMw = require('../../modules/swagger-setup/middleware/seneca');

module.exports = {
    getAllTeams: senecaRequestMw(
        'role:db,cmd:getAllTeams',
        req => ({
            CC: req.swagger.params.country.value,
            search: req.swagger.params.search && req.swagger.params.search.value,
        }),
    ),
    getAllTeamsWeb: senecaRequestMw(
        'role:db,cmd:getAllTeamsWeb',
        req => ({
            CC: req.swagger.params.country.value,
            superadmin: req.swagger.params.superadmin.value,
        }),
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
