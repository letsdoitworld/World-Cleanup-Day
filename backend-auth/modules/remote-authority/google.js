'use strict';
const google = require('googleapis');

const auth = google.oauth2('v2');
const OAuth2 = google.auth.OAuth2;

module.exports = {
    getUserData: token => {
        const authClient = new OAuth2();
        authClient.setCredentials({
            access_token: token,
        });

        return new Promise((resolve, reject) => {
            auth.userinfo.v2.me.get(
                {
                    fields: 'email,id,name',
                    auth: authClient,
                },
                function (err, response) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response);
                    }
                }
            );
        });
    },
};
