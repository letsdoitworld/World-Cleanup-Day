'use strict';
const senecaRequestMw = require('../../modules/swagger-setup/middleware/seneca');

module.exports = {
    externalLogin: senecaRequestMw(
        'role:auth,cmd:socialLogin',
        req => req.swagger.params.credentials.value,
    ),
    logout: senecaRequestMw(
        'role:auth,cmd:logout',
        () => ({}),
        res => res.json(), // blank body
    ),
    modifyUserProfile: senecaRequestMw(
        'role:db,cmd:modifyOwnUserProfile',
        req => ({
            update: req.swagger.params.update.value,
        }),
    ),
    modifyUserProfilePrivacy: senecaRequestMw(
        'role:db,cmd:modifyOwnProfilePrivacy',
        req => ({
            update: req.swagger.params.update.value,
        }),
    ),
    getUserProfile: senecaRequestMw(
        'role:db,cmd:getAccountById',
        req => ({
            accountId: req.__.user.id,
            filterFields: true,
        })
    ),
    acceptTerms: senecaRequestMw(
        'role:db,cmd:acceptTerms',
        () => ({}),
        res => res.json(), // blank body
    ),
    getAllUsers: senecaRequestMw(
        'role:db,cmd:getAccounts',
        req => ({
            pageSize: req.swagger.params.pageSize.value,
            pageNumber: req.swagger.params.pageNumber.value,
            country: req.swagger.params.country.value,
            nameSearch: req.swagger.params.nameSearch.value,
            userRole: req.swagger.params.userRole.value,
        }),
    ),
    getOneUser: senecaRequestMw(
        'role:db,cmd:getAccountById',
        req => ({
            accountId: req.swagger.params.id.value,
        })
    ),
    lockAccount: senecaRequestMw(
        'role:db,cmd:lockAccount',
        req => ({
            locked: req.swagger.params.request.value.locked,
            accountId: req.swagger.params.id.value,
        }),
        res => res.json(), // blank body
    ),
};
