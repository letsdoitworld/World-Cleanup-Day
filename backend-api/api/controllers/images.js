'use strict';
const senecaRequestMw = require('../../modules/swagger-setup/middleware/seneca');

module.exports = {
    getTrashpointImages: senecaRequestMw(
        'role:db,cmd:getTrashpointImages',
        req => ({
            trashpointId: req.swagger.params.id.value,
        }),
    ),
    allocateTrashpointImages: senecaRequestMw(
        'role:db,cmd:allocateTrashpointImages',
        req => ({
            trashpointId: req.swagger.params.id.value,
            request: req.swagger.params.request.value,
        }),
    ),
    confirmTrashpointImages: senecaRequestMw(
        'role:db,cmd:confirmTrashpointImages',
        req => ({
            trashpointId: req.swagger.params.id.value,
            request: req.swagger.params.request.value,
        }),
        res => res.json(), // blank body
    ),
    deleteTrashpointImages: senecaRequestMw(
        'role:db,cmd:deleteTrashpointImages',
        req => ({
            trashpointId: req.swagger.params.id.value,
            request: {
                delete: [
                    req.swagger.params.id2.value,
                ],
            },
        }),
        res => res.json(), // blank body
    ),
    getEventImages: senecaRequestMw(
        'role:db,cmd:getEventImages',
        req => ({
            eventId: req.swagger.params.id.value,
        }),
    ),
    allocateEventImages: senecaRequestMw(
        'role:db,cmd:allocateEventImages',
        req => ({
            eventId: req.swagger.params.id.value,
            request: req.swagger.params.request.value,
        }),
    ),
    confirmEventImages: senecaRequestMw(
        'role:db,cmd:confirmEventImages',
        req => ({
            eventId: req.swagger.params.id.value,
            request: req.swagger.params.request.value,
        }),
        res => res.json(), // blank body
    ),
    deleteEventImages: senecaRequestMw(
        'role:db,cmd:deleteEventImages',
        req => ({
            eventId: req.swagger.params.id.value,
            request: {
                delete: [
                    req.swagger.params.id2.value,
                ],
            },
        }),
        res => res.json(), // blank body
    )
};
