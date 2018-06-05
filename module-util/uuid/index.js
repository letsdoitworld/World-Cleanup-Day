'use strict';
const timestamp = require('uuid/v1');
const random = require('uuid/v4');
const namespace = require('uuid/v5');

module.exports = {
    timestamp: () => timestamp(),
    random: () => random(),
    nsCustom: (custom, ns) => namespace(custom, ns),
};
