'use strict';
const senecaRequestMw = require('../../modules/swagger-setup/middleware/seneca');

module.exports = {
    getMyAreas: senecaRequestMw(
        'role:db,cmd:getMyAreas',
    ),
    getUserAreas: senecaRequestMw(
        'role:db,cmd:getUserAreas',
        req => ({
            accountId: req.swagger.params.id.value,
        }),
    ),
    getAllAreas: senecaRequestMw(
        'role:db,cmd:getAllAreas',
        req => ({
            parentId: req.swagger.params.parentId.value,
        }),
    ),
    assignAreaLeader: senecaRequestMw(
        'role:db,cmd:assignAreaLeader',
        req => ({
            areaId: req.swagger.params.id.value,
            accountId: req.swagger.params.id2.value,
        }),
        res => res.json() // blank response
    ),
    removeAreaLeader: senecaRequestMw(
        'role:db,cmd:removeAreaLeader',
        req => ({
            areaId: req.swagger.params.id.value,
            accountId: req.swagger.params.id2.value,
        }),
        res => res.json() // blank response
    ),
    getAreaTrashpoints: senecaRequestMw(
        'role:db,cmd:getAreaTrashpoints',
        req => ({
            areaId: req.swagger.params.id.value === '-' ? null : req.swagger.params.id.value,
            pageSize: req.swagger.params.pageSize.value,
            pageNumber: req.swagger.params.pageNumber.value,
        }),
    ),
    getAreaLeaders: senecaRequestMw(
        'role:db,cmd:getAreaLeaders',
        req => ({
            areaId: req.swagger.params.id.value
        })
    )
};
