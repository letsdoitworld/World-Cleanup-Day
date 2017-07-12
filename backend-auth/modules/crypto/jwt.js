'use strict';
const jwt = require('jsonwebtoken');
const logger = require('module-logger');

const SECRET = process.env.JWT_SECRET;
const EXPIRATION = process.env.JWT_EXPIRATION;

module.exports = {
    create: content => {
        try {
            return jwt.sign(content, SECRET, {expiresIn: EXPIRATION});
        } catch (e) {
            logger.critical(e);
            return false;
        }
    },
    verify: token => {
        try {
            return jwt.verify(token, SECRET);
        } catch (e) {
            logger.critical(e);
            return false;
        }
    },
};
