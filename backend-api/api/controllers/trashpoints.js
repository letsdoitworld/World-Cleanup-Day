'use strict';
const senecaRequestMw = require('../../modules/swagger-setup/middleware/seneca');

module.exports = {
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
    removeTrashpoint: senecaRequestMw(
        'role:db,cmd:deleteTrashpoint',
        req => ({
            trashpointId: req.swagger.params.id.value,
        }),
        res => res.json() // blank body
    ),
    getTrashpointsOverview: senecaRequestMw(
        'role:db,cmd:getTrashpointsOverview',
        req => req.swagger.params.query.value,
    ),
    getClustersOverview: senecaRequestMw(
        'role:db,cmd:getClustersOverview',
        req => req.swagger.params.query.value,
    ),
    getTrashpointsInGridCell: senecaRequestMw(
        'role:db,cmd:getTrashpointsInGridCell',
        req => req.swagger.params.query.value,
    ),
    getAllTrashpoints: senecaRequestMw(
        'role:db,cmd:getAdminTrashpoints',
        req => ({
            pageSize: req.swagger.params.pageSize.value,
            pageNumber: req.swagger.params.pageNumber.value,
        }),
    ),
};
