'use strict';
const senecaRequestMw = require('../../modules/swagger-setup/middleware/seneca');
const filters = require('./filters');

module.exports = {
  getEventById: senecaRequestMw(
    'role:db,cmd:getEventById',
    req => ({
      id: req.swagger.params.id.value
    })
  ),
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
      location: req.swagger.params.location.value,
      name: req.swagger.params.name.value
    })
  ),
  getEventsOverview: senecaRequestMw(
    'role:db,cmd:getEventsOverview',
    req => filters.convertGeoScale(req.swagger.params.query.value),
  ),
  getEventsClustersOverview: senecaRequestMw(
    'role:db,cmd:getEventsClustersOverview',
    req => filters.convertGeoScale(req.swagger.params.query.value),
  ),
  getEventsInGridCell: senecaRequestMw(
    'role:db,cmd:getEventsInGridCell',
    req => filters.convertGeoScale(req.swagger.params.query.value),
  ),
  getUserOwnEvents: senecaRequestMw(
    'role:db,cmd:getUserOwnEvents',
    req => ({
      pageSize: req.swagger.params.pageSize.value,
      pageNumber: req.swagger.params.pageNumber.value
    })
  )
}
