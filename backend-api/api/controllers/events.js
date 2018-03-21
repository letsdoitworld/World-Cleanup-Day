'use strict';
const senecaRequestMw = require('../../modules/swagger-setup/middleware/seneca');

module.exports = {
  createEvent: senecaRequestMw(
    'role:db,cmd:createEvent',
    req => ({
      event: req.swagger.params.event.value
    })
  ),
  getEvents: senecaRequestMw(
    'role:db,cmd:getEvents',
    req => ({
      pageSize: req.swagger.params.pageSize.value,
      pageNumber: req.swagger.params.pageNumber.value,
      radius: req.swagger.params.radius.value,
      location: req.swagger.params.location.value
    })
  ),
  getUserOwnEvents: senecaRequestMw(
    'role:db,cmd:getUserOwnEvents',
    req => ({
      pageSize: req.swagger.params.pageSize.value,
      pageNumber: req.swagger.params.pageNumber.value
    })
  )
}
