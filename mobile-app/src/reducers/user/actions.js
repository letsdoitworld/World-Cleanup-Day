import types from './types';

const setToken = token => ({
  type: types.SET_AUTH_TOKEN,
  payload: token,
});

const setAuthError = error => ({
  type: types.SET_AUTH_ERROR,
  payload: error,
});

const removeToken = () => ({
  type: types.REMOVE_AUTH_TOKEN,
  meta: {
    logout: true,
  },
});

const fetchProfile = () => ({ type: types.FETCH_PROFILE });
const fetchProfileDone = profile => ({
  type: types.FETCH_PROFILE_SUCCESS,
  payload: profile,
});
const fetchProfileError = error => ({
  type: types.FETCH_PROFILE_ERROR,
  payload: error,
});

const updateProfile = () => ({ type: types.UPDATE_PROFILE });
const updateProfileDone = profile => ({
  type: types.UPDATE_PROFILE_DONE,
  payload: profile,
});
const updateProfileError = error => ({
  type: types.UPDATE_PROFILE_ERROR,
  payload: error,
});

const agreeToTerms = () => ({
  type: types.TERMS_AGREE,
});

export default {
  setToken,
  setAuthError,
  removeToken,
  agreeToTerms,
  fetchProfile,
  fetchProfileDone,
  fetchProfileError,
  updateProfile,
  updateProfileDone,
  updateProfileError,
};
