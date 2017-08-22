'use strict';
const senecaRequestMw = require('../../modules/swagger-setup/middleware/seneca');

module.exports = {
    getAllDatasets: senecaRequestMw(
        'role:db,cmd:getAllDatasets'
    ),
};
