'use strict';
const graph = require('fbgraph');
graph.setVersion('2.9');

const getUserData = token => {
    return new Promise((resolve, reject) => {
        graph.get(
            `/me?fields=id,name,email,picture.type(large)&access_token=${token}`,
            (err, res) => {
                if (err) {
                    return reject(new Error(`${err.type}: ${err.message}`));
                }

                return resolve({
                    id: res.id,
                    email: res.email,
                    name: res.name,
                    pictureURL: res.picture.data.url,
                });
            }
        );
    });
}

module.exports = {
    getUserData,
};
