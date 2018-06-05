'use strict';
const grid = require('../../../geo/grid.js');

const replaceTemplateMacros = (template, macros) => {
    const macroNames = Object.getOwnPropertyNames(macros);
    const rpMacros = (what) => {
        let s = what.toString();
        macroNames.forEach(mac => {
            s = s.replace(mac, macros[mac]);
        });
        return s;
    };
    if (template.map) {
        template.map = rpMacros(template.map);
    }
    if (template.reduce) {
        template.reduce = rpMacros(template.reduce);
    }
    return template;
};

const makeScaleView = (scale, view) => {
    return replaceTemplateMacros(view, {
        '$$LENGTH$$': grid.SCALES[scale],
        '$$GRID_CONVERTER$$': grid.geoToGrid.toString(),
    });
};

const makeAreaView = (view) => {
    return replaceTemplateMacros(view, {
        '$$COPY_SANS_GEOMETRY$$': function (o) {
            var copy = {};
            for (var prop in o) {
                if (prop !== 'geometry' && o.hasOwnProperty(prop)) {
                    copy[prop] = o[prop];
                }
            }
            return copy;
        }.toString(),
    });
};

module.exports = {
    replaceTemplateMacros,
    makeAreaView,
    makeGridScaleDesignDocs: (version, prefix, template) => {
        const N = {};
        Object.getOwnPropertyNames(grid.SCALES).forEach(scale => {
            N[prefix + scale] = {
                $version: version,
                views: {
                    view: makeScaleView(scale, Object.assign({}, template)),
                },
            };
        });
        return N;
    },
};
