import { Facebook, Google, Constants } from 'expo';
import _ from 'lodash';

import Api from './Api';

import {
  FACEBOOK_APP_ID,
  GOOGLE_ANDROID_APP_ID,
  GOOGLE_IOS_APP_ID,
  GOOGLE_ANDROID_EXPO_ID,
  GOOGLE_IOS_EXPO_ID,
} from '../../env';

const isStandaloneApp = Constants.appOwnership === 'standalone';

const SOCIAL_NETWORKS = {
  FACEBOOK: 'FACEBOOK',
  GOOGLE: 'GOOGLE',
};
const BACKEND_LOGIN_SOURCES = {
  FACEBOOK: 'facebook',
  GOOGLE: 'google',
};

const isTypeSuccess = (type) => {
  return type === 'success';
};
const loginFacebook = async () => {
  // TOOD check the other options that need to be send to Facebook, if any
  const data = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
    behavior: isStandaloneApp ? 'native' : 'web',
    scopes: ['public_profile', 'email'],
  });
  return data;
};
const loginGoogle = async () => {
  const config = {
    androidStandaloneAppClientId: GOOGLE_ANDROID_APP_ID,
    iosStandaloneAppClientId: GOOGLE_IOS_APP_ID,
    androidClientId: GOOGLE_ANDROID_EXPO_ID,
    iosClientId: GOOGLE_IOS_EXPO_ID,
    behavior: 'web',
  };
  try {
    const { accessToken, ...rest } = await Google.logInAsync(config);
    return { token: accessToken, ...rest };
  } catch (ex) {
    console.log(ex);
    throw ex;
  }
};

const NETWORK_MAP = {
  [SOCIAL_NETWORKS.FACEBOOK]: loginFacebook,
  [SOCIAL_NETWORKS.GOOGLE]: loginGoogle,
};

class UnknownSocialNetworkException {
  constructor(network) {
    this.network = network;

    this.toString = this.toString.bind(this);
  }
  toString() {
    return `Social network ${this.network} is unknown`;
  }
}
class TokenFetchException {
  constructor(network) {
    this.network = network;

    this.toString = this.toString.bind(this);
  }
  toString() {
    return `Could not fetch the token for the social network ${this.network}`;
  }
}

const fetchNetworkTokenAsync = async (network) => {
  if (!SOCIAL_NETWORKS[network]) {
    throw new UnknownSocialNetworkException(network);
  }

  const { token, type } = await NETWORK_MAP[network]();
  if (!isTypeSuccess(type)) {
    throw new TokenFetchException(network);
  }

  const response = await Api.post(
    '/auth/external',
    {
      source: BACKEND_LOGIN_SOURCES[network],
      token,
    },
    { withToken: false },
  );
  if (!_.has(response, 'data.token')) {
    throw { error: 'Could not read authentification response data' };
  }

  const networkToken = response.data.token;
  Api.setAuthToken(networkToken);
  return networkToken;
};

export {
  SOCIAL_NETWORKS,
  fetchNetworkTokenAsync,
  UnknownSocialNetworkException,
  TokenFetchException,
};
