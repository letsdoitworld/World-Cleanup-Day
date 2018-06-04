'use strict';
const exceptionFactory = require('module-lucius/error/factory');
const {Lucius} = require('module-lucius');
const util = require('module-util');

const SwaggerSecurityError = exceptionFactory(
    'swaggerSecurityError',
    function (code, message) {
        this.code = code;
        this.message = message;
        this.swaggerSecurity = true;
        this.stack = (new Error(message)).stack;
    }
);

const isDefBearer = (def) => def === 'bearer';
const isDefIgnoreTermsLock = (def) => def === 'ignore-terms-lock';
const isDefRoles = (def) => typeof def === 'object' && def.hasOwnProperty('roles');

const xSecurityCheck = (req, res, next) => {
    if (req.swagger
        && req.swagger.operation
        && req.swagger.operation['x-security']
    ) {
        const definitions = req.swagger.operation['x-security'];
        if (!Array.isArray(definitions)) {
            return next(new SwaggerSecurityError(
                'SECURITY_BAD_DEFINITION',
                'x-security must be array.'
            ));
        }
        req.hasSecurity = true;
    }
    next();
}

const definitionsCheck = (req, res, next) => {
    if (!req.hasSecurity) {
        return next();
    }
    const definitions = req.swagger.operation['x-security'];
    const unknownDefIndex = definitions.findIndex(
        (def) => !(
            isDefBearer(def) ||
            isDefIgnoreTermsLock(def) ||
            isDefRoles(def)
        )
    );
    if (unknownDefIndex !== -1) {
        return next(new SwaggerSecurityError(
            'SECURITY_UNKNOWN_POLICY',
            `Unknown security policy at index ${unknownDefIndex}.`
        ));
    }
    next();
};

const bearerCheck = async (req, res, next) => {
    if (!req.hasSecurity) {
        return next();
    }
    const definitions = req.swagger.operation['x-security'];
    const defBearer = definitions.find(def => isDefBearer(def));
    if (!defBearer) {
        return next();
    }
    const lucius = new Lucius(req.__.seneca);
    try {
        const response = await lucius.request(
            'role:auth,cmd:verifyToken', {token: req.token}
        );
        if (response.isSuccessful()) {
            const ret = response.getPayload();
            req.__.user = util.object.filter(ret.account, {
                id: true, termsAcceptedAt: true, role: true, team: true
            });
            req.__.session = ret.session;
            return next();
        }
        else {
            // business logic errors become 403, because i'm a security check
            res.status(403);
            return next(response.getErrors());
        }
    } catch (e) {
        return next(lucius.getFatalError(e));
    }
};

const termsCheck = (req, res, next) => {
    if (!req.hasSecurity) {
        return next();
    }
    const definitions = req.swagger.operation['x-security'];
    const defIgnoreTermsLock = definitions.find(def => isDefIgnoreTermsLock(def));
    // if we have user info on which to base a decision (ie. there was a bearer check)
    if (req.__ && req.__.user
        // and the user has not accepted terms yet
        && !req.__.user.termsAcceptedAt
        // and there's no policy to allow terms skipping on this endpoint
        && !defIgnoreTermsLock
    ) {
        // deny access
        res.status(403);
        return next(new SwaggerSecurityError(
            'SECURITY_TERMS_CHECK_FAIL',
            'The user has not accepted terms and conditions.'
        ));
    }
    next();
};

const roleCheck = (req, res, next) => {
    if (!req.hasSecurity) {
        return next();
    }
    const definitions = req.swagger.operation['x-security'];
    const defRoles = definitions.find(def => isDefRoles(def));
    if (!defRoles) {
        return next();
    }
    const requiredRoles = defRoles.roles;
    if (!Array.isArray(requiredRoles)) {
        return next(new SwaggerSecurityError(
            'SECURITY_BAD_ROLE_SET',
            `The value of the 'roles' entry must be array.`
        ));
    }
    requiredRoles.forEach((role, index) => {
        if (typeof role !== 'string') {
            return next(new SwaggerSecurityError(
                'SECURITY_BAD_ROLE',
                `Role at index ${index} is not string.`
            ));
        }
    });
    if (requiredRoles.indexOf(req.__.user.role) === -1) {
        res.status(403);
        return next(new SwaggerSecurityError(
            'SECURITY_NO_ROLE',
            'The user does not have any of the roles required for this operation: '
            + requiredRoles.join(', ')
        ));
    }
    next();
};

// XXX: The order of the middlewares is essential,
// do not change it unless you know what you're doing.
module.exports = [
    xSecurityCheck,
    definitionsCheck,
    bearerCheck,
    termsCheck,
    roleCheck,
];
