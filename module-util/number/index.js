'use strict';

const Number = module.exports = {
    humanByteSize: size => {
        const um = ['TB', 'GB', 'MB', 'KB', 'B'];
        const x = 1024;
        let big = Math.pow(x, um.length - 1);
        for (let u of um) {
            // console.log(u, size, big);
            if (size >= big) {
                return u === 'B' ? size + 'B' : parseFloat(size / big).toFixed(2) + u;
            }
            big = big / x;
        }
    },
    humanizeNumbers: o => {
        Object.getOwnPropertyNames(o).forEach(prop => {
            if (typeof o[prop] === 'number') {
                o[prop] = Number.humanByteSize(o[prop]);
            }
        });
        return o;
    },
};
