export const SET_AUTH_TOKEN = 'auth/SET_TOKEN';
export const setToken = token => ({
  type: SET_AUTH_TOKEN,
  payload: token,
});

export const SET_AUTH_ERROR = 'auth/SET_ERROR';
export const setAuthError = error => ({
  type: SET_AUTH_ERROR,
  payload: error,
});

export const REMOVE_AUTH_TOKEN = 'auth/REMOVE_TOKEN';
export const removeToken = () => ({
  type: REMOVE_AUTH_TOKEN,
  meta: {
    logout: true,
  },
});

export const GOOGLE_LOGIN_ACTION = 'GOOGLE_LOGIN_ACTION';
export const loginGoogle = () => ({
  type: GOOGLE_LOGIN_ACTION,
});

export const FB_LOGIN_ACTION = 'FB_LOGIN_ACTION';
export const loginFacebook = () => ({
  type: FB_LOGIN_ACTION,
});