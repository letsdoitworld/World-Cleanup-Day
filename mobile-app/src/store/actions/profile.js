export const FETCH_PROFILE = 'profile/FETCH_PROFILE';
export const fetchProfile = () => ({
  type: FETCH_PROFILE,
});

export const FETCH_PROFILE_SUCCESS = 'profile/FETCH_PROFILE_SUCCESS';
export const fetchProfileDone = profile => {
  console.log('fetchProfileDone Action', profile);
  return {
  type: FETCH_PROFILE_SUCCESS,
  payload: profile,
}};

export const FETCH_PROFILE_ERROR = 'profile/FETCH_PROFILE_ERROR';
export const fetchProfileError = error => ({
  type: FETCH_PROFILE_ERROR,
  payload: error,
});

export const UPDATE_PROFILE = 'profile/UPDATE_PROFILE';
export const updateProfile = () => ({
  type: UPDATE_PROFILE,
});

export const UPDATE_PROFILE_DONE = 'profile/UPDATE_PROFILE_DONE';
export const updateProfileDone = profile => ({
  type: UPDATE_PROFILE_DONE,
  payload: profile,
});

export const UPDATE_PROFILE_ERROR = 'profile/UPDATE_PROFILE_ERROR';
export const updateProfileError = error => ({
  type: UPDATE_PROFILE_ERROR,
  payload: error,
});

export const TERMS_AGREE = 'profile/TERMS_AGREE';
export const agreeToTerms = () => ({
  type: TERMS_AGREE,
});

export const UPDATE_PROFILE_STATUS_ACTION = 'profile/UPDATE_PROFILE_PRIVACY_STATUS';
export const updateProfileStatus = status => ({
  type: UPDATE_PROFILE_STATUS_ACTION,
  status,
});

export const UPDATE_PROFILE_STATUS_SUCCESS = 'profile/UPDATE_PROFILE_STATUS_SUCCESS';
export const UPDATE_PROFILE_STATUS_ERROR = 'profile/UPDATE_PROFILE_STATUS_ERROR';
