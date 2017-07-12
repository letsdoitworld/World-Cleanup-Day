'use strict';
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

module.exports = {
    create: data => bcrypt.hash(data, SALT_ROUNDS),
    matches: (data, hash) => bcrypt.compare(data, hash),
};
