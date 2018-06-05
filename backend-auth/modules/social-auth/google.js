'use strict';
const google = require('googleapis');

const auth = google.oauth2('v2');
const OAuth2 = google.auth.OAuth2;

const getUserData = token => {
    const authClient = new OAuth2();
    authClient.setCredentials({
        // eslint-disable-next-line camelcase
        access_token: token,
    });

    return new Promise((resolve, reject) => {
        auth.userinfo.v2.me.get(
            {
                fields: 'email,id,name,picture',
                auth: authClient,
            },
            function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        id: res.id,
                        email: res.email,
                        name: res.name,
                        pictureURL: res.picture,
                    });
                }
            }
        );
    });
};

module.exports = {
    getUserData,
};