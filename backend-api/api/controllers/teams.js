'use strict';
const senecaRequestMw = require('../../modules/swagger-setup/middleware/seneca');

module.exports = {
    getAllTeams: senecaRequestMw(
        'role:db,cmd:getAllTeams',
        req => ({
            CC: req.swagger.params.country.value,
            search: req.swagger.params.search.value,
        }),
    ),
    getTeamsInBetween: senecaRequestMw(
        'role:db,cmd:getTeamsInBetween',
        req => ({
          from: req.swagger.params.from.value,
          to: req.swagger.params.to.value,
          nameTeam: req.swagger.params.nameTeam.value,
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
