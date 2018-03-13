import { GoogleSignin } from 'react-native-google-signin';

import Api from '../services/Api';
import constants from '../shared/constants';

const FBSDK = require('react-native-fbsdk');

const {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

function getAuthHeader(authToken) {
  return {
    ...constants.BASE_HEADER,
    Authorization: `Bearer ${authToken}`,
  };
}

function googleLogin() {
  return GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    iosClientId:
      '544878604136-p23hd99c43c7b9bpkl0mkd214f4a0008.apps.googleusercontent.com',
    webClientId:
      '343042629555-168fin9loioa94ttsudsi1lptea79l4b.apps.googleusercontent.com',
    offlineAccess: false,
  })
    .then(() => {
      return GoogleSignin.signIn();
    })
    .catch((error) => {
      throw error;
    });
}

function facebookLogin() {
  return LoginManager.logInWithReadPermissions(['public_profile', 'user_location'])
        .then((result) => {
          if (result.isCancelled) {
            throw 'Login cancelled';
          } else {
            return AccessToken.getCurrentAccessToken()
              .then((data) => {
                return new Promise((resolve, reject) => {
                  new GraphRequestManager().addRequest(new GraphRequest(
                    '/me?fields=email,locations',
                      null,
                      (err, res) => {
                        if (err) {
                          reject(err);
                        }
                        console.log('FB auth User', res);

                        const email = res.email && res.email;
                        const location = res.location && res.location;

                        const updatedData = {
                          token: data,
                          email,
                          location,
                        };

                        resolve(updatedData);
                      },
                  )).start();
                });
              });
          }
        })
        .catch(error => error);
}

async function logout() {
  try {
    await Api.delete('/auth', { skipError: true });
  } catch (ex) {
    throw ex;
  }
}

async function agreeToTerms() {
  try {
    const response = await Api.put(
      '/me/accept-terms',
      {},
      { withToken: true },
      {
        'Content-Type': 'application/json',
      },
    );
    return response.data;
  } catch (ex) {
    throw ex;
  }
}

export default {
  getAuthHeader,
  googleLogin,
  facebookLogin,
  logout,
  agreeToTerms,
};

