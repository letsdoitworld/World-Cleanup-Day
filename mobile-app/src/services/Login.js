import { Facebook, Google, Constants } from 'expo';

// TODO fetch these data from enviroment variables, instead of harcoding them
const FACEBOOK_TEST_APP_ID = '490272021318582';
const GOOGLE_ANDROID_TEST_ID =
  '788448594922-vi1s9gtu7oluic42gl162k7lv5agcibq.apps.googleusercontent.com';
// dev only id
// TODO get the production id from env.js
const GOOGLE_IOS_TEST_ID =
  '788448594922-rj1msm8rvm2seg5jf59eo5gd36dukon1.apps.googleusercontent.com';

const SOCIAL_NETWORKS = {
  FACEBOOK: 'FACEBOOK',
  GOOGLE: 'GOOGLE',
};

const isTypeSuccess = (type) => {
  return type === 'success';
};

const loginFacebook = async () => {
  // TOOD check the other options that need to be send to Facebook, if any
  return Facebook.logInWithReadPermissionsAsync(FACEBOOK_TEST_APP_ID);
};
const loginGoogle = async () => {
  // TODO check the other options that need to be sent to Google, if any
  const isOnDevice = Constants.appOwnership !== 'expo';
  const expoConfig = {
    androidClientId: GOOGLE_ANDROID_TEST_ID,
    iosClientId: GOOGLE_IOS_TEST_ID,
  };
  const onDeviceConfig = {
    androidStandaloneAppClientId: '',
    iosStandaloneAppClientId: '',
  };

  const { accessToken, ...rest } = await Google.logInAsync(
    isOnDevice ? onDeviceConfig : expoConfig,
  );

  // the access token property needs to be changed to token, since that the interface this is using
  return { token: accessToken, ...rest };
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

  if (isTypeSuccess(type)) {
    return { token };
  }
  throw new TokenFetchException(network);
};

export {
  SOCIAL_NETWORKS,
  fetchNetworkTokenAsync,
  UnknownSocialNetworkException,
  TokenFetchException,
};
