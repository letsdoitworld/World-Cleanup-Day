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
  getTeam: senecaRequestMw(
    'role:db,cmd:getTeam',
    req => ({
      id: req.swagger.params.id.value,
    }),
  )
};