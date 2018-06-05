'use strict';
const senecaRequestMw = require('../../modules/swagger-setup/middleware/seneca');
const filters = require('./filters');

module.exports = {
    getTrashpoints: senecaRequestMw(
      'role:db,cmd:getTrashpoints',
      req => ({
        pageSize: req.swagger.params.pageSize.value,
        pageNumber: req.swagger.params.pageNumber.value,
        name: req.swagger.params.name.value,
        location: req.swagger.params.location.value
      })
    ),
    createTrashpoint: senecaRequestMw(
        'role:db,cmd:createTrashpoint',
        req => ({
            trashpoint: req.swagger.params.trashpoint.value,
        }),
    ),
    modifyTrashpoint: senecaRequestMw(
        'role:db,cmd:modifyTrashpoint',
        req => ({
            trashpointId: req.swagger.params.id.value,
            trashpointData: req.swagger.params.trashpoint.value,
        }),
    ),
    getUserOwnTrashpoints: senecaRequestMw(
        'role:db,cmd:getUserOwnTrashpoints',
        req => ({
            pageSize: req.swagger.params.pageSize.value,
            pageNumber: req.swagger.params.pageNumber.value,
        })
    ),
    getTrashpoint: senecaRequestMw(
        'role:db,cmd:getTrashpointById',
        req => ({
            id: req.swagger.params.id.value,
        }),
    ),
    getDetailsTrashpoints: senecaRequestMw(
        'role:db,cmd:getDetailsTrashpoints',
        req => ({}),
    ),
    removeTrashpoint: senecaRequestMw(
        'role:db,cmd:deleteTrashpoint',
        req => ({
            trashpointId: req.swagger.params.id.value,
        }),
        res => res.json() // blank body
    ),
    getTrashpointsOverview: senecaRequestMw(
        'role:db,cmd:getTrashpointsOverview',
        req => filters.convertGeoScale(req.swagger.params.query.value),
    ),
    getClustersOverview: senecaRequestMw(
        'role:db,cmd:getClustersOverview',
        req => filters.convertGeoScale(req.swagger.params.query.value),
    ),
    getTrashpointsInGridCell: senecaRequestMw(
        'role:db,cmd:getTrashpointsInGridCell',
        req => filters.convertGeoScale(req.swagger.params.query.value),
    ),
    getAllTrashpoints: senecaRequestMw(
        'role:db,cmd:getAdminTrashpoints',
        req => ({
            pageSize: req.swagger.params.pageSize.value,
            pageNumber: req.swagger.params.pageNumber.value,
        }),
    ),
};
