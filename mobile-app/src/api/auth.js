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
      '931132275173-fvb2788pvr62qsaugvmi7qa58tq01jmu.apps.googleusercontent.com',
    webClientId:
      '931132275173-vpsdvsgftc4mlpm5mump3chdcp34f2h0.apps.googleusercontent.com',
    offlineAccess: false,
  })
    .then(() => {
      return GoogleSignin.signIn();
    })
    .catch((error) => {
      throw error;
    },
    );
}

function facebookLogin() {
  return LoginManager.logInWithReadPermissions(['public_profile'])
    .then((result) => {
      if (result.isCancelled) {
        throw new Error('Login cancelled');
      } else {
        return AccessToken.getCurrentAccessToken()
          .then((data) => {
            return new Promise((resolve, reject) => {
              new GraphRequestManager().addRequest(new GraphRequest(
                '/me?fields=email',
                null,
                (err, res) => {
                  if (err) {
                    reject(err);
                  }

                  const email = res.email && res.email;

                  const updatedData = {
                    token: data,
                    email,
                  };

                  resolve(updatedData);
                },
              )).start();
            });
          });
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
}

async function logout() {
  try {
    await Api.delete('/auth');
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

