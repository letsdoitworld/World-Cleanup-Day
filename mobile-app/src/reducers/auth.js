import { fetchNetworkTokenAsync, SOCIAL_NETWORKS, TokenFetchException } from '../services/Login';

const SET_TOKEN = 'auth/SET_TOKEN';
const SET_TOKEN_ERROR = 'auth/SET_TOKEN_ERROR';
const REMOVE_TOKEN = 'auth/REMOVE_TOKEN';

const INITIAL_STATE = {
  token: undefined,
  tokenNetwork: undefined,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_TOKEN: {
      return { ...state, token: action.payload };
    }
    case REMOVE_TOKEN: {
      return { ...state, token: undefined };
    }
    default: {
      return state;
    }
  }
};

// inner "private" methods
const setStoreToken = token => ({
  type: SET_TOKEN,
  payload: token,
});

const resetStoreToken = () => ({
  type: REMOVE_TOKEN,
  meta: {
    // this will help with detecting when the action plays the role of a logout,
    // without binding to a certain string
    logout: true,
  },
});
const setToken = (token) => {
  return token ? setStoreToken(token) : resetStoreToken();
};

const setTokenError = (error) => {
  return {
    type: SET_TOKEN_ERROR,
    payload: error,
  };
};

const googleLogin = () => async (dispatch) => {
  try {
    const token = await fetchNetworkTokenAsync(SOCIAL_NETWORKS.GOOGLE);
    dispatch(setToken(token));
    return token;
  } catch (ex) {
    dispatch(setTokenError(ex));
    throw ex;
  }
};
const facebookLogin = () => async (dispatch) => {
  try {
    const token = await fetchNetworkTokenAsync(SOCIAL_NETWORKS.FACEBOOK);
    dispatch(setToken(token));
  } catch (ex) {
    dispatch(setTokenError(ex));
    throw ex;
  }
};
const logout = () => resetStoreToken;

export const actions = {
  googleLogin,
  facebookLogin,
  logout,
};

const isAuthenticated = state => !!state.token;

export const selectors = {
  isAuthenticated,
};
