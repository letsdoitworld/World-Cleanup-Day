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

export const LOGOUT = 'auth/LOGOUT';
export const logout = () => ({
  type: LOGOUT,
});

export const GOOGLE_LOGIN_ACTION = 'auth/GOOGLE_LOGIN_ACTION';
export const loginGoogle = () => ({
  type: GOOGLE_LOGIN_ACTION,
});

export const FB_LOGIN_ACTION = 'auth/FB_LOGIN_ACTION';
export const loginFacebook = () => ({
  type: FB_LOGIN_ACTION,
});

export const SET_GUEST_SESSION = 'auth/SET_GUEST_SESSION';
export const setGuestSession = () => ({
  type: SET_GUEST_SESSION,
});

export const GUEST_LOG_IN = 'auth/GUEST_LOG_IN';
export const guestLogIn = () => ({
  type: GUEST_LOG_IN,
});

export const REHYDRATE = 'persist/REHYDRATE';
