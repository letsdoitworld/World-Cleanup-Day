'use strict';
'use strict';
const fs = require('fs');
// var unidecode = require('unidecode');

const content = fs.readFileSync(process.stdin.fd).toString();
const raw = JSON.parse(content);
const OUT = {};

OUT.name = raw.features[0].properties.NAME_ENGLISH;
OUT.code = raw.features[0].properties.ISO2;
OUT.geometry = raw.features[0].geometry;

fs.writeFileSync(OUT.code + '.json', JSON.stringify(OUT), {encoding: 'UTF-8'});
