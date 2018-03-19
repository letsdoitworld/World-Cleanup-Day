'use strict'
const senecaRequestMw = require('../../modules/swagger-setup/middleware/seneca')

module.exports = {
  createEvent: senecaRequestMw(
    'role:db,cmd:createEvent',
    req => ({
      event: req.swagger.params.event.value
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
