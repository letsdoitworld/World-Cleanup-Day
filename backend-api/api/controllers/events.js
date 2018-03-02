'use strict'
const senecaRequestMw = require('../../modules/swagger-setup/middleware/seneca')

module.exports = {
  createEvent: senecaRequestMw(
    'role:db,cmd:createEvent',
    req => ({
      event: req.swagger.params.event
    })
  )
}
