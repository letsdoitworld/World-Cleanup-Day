const SET_USER_LOCATION = 'SET_USER_LOCATION';
const SET_CACHED_LOCATION = 'SET_CACHED_LOCATION';
const CONGRATS_SHOWN = 'user/CONGRATS_SHOWN';
const SET_PROFILE_COUNTRY = 'SET_PROFILE_COUNTRY';

const INITIAL_STATE = {
  location: {
    latitude: null,
    longitude: null,
  },
  cachedLocation: {
    latitude: null,
    longitude: null,
  },
  congratsShown: false,
  profile: {
    country: '',
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_USER_LOCATION:
      return { ...state, location: action.location };
    case SET_CACHED_LOCATION:
      return { ...state, cachedLocation: action.cachedLocation };
    case CONGRATS_SHOWN:
      return { ...state, congratsShown: action.payload };
    case SET_PROFILE_COUNTRY:
      return { ...state, profile: { ...state.profile, country: action.country } };
    default:
      return state;
  }
};

const setUserLocation = ({ latitude, longitude }) => {
  return {
    type: SET_USER_LOCATION,
    location: { latitude, longitude },
  };
};

const setCachedLocation = () => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_CACHED_LOCATION,
      cachedLocation: getState().user.location,
    });
  };
};
const setCongratsShown = shown => {
  return {
    type: CONGRATS_SHOWN,
    payload: shown,
  };
};

const setProfileCountry = (country) => ({
  type: SET_PROFILE_COUNTRY,
  country
});

export const actions = {
  setUserLocation,
  setCachedLocation,
  setCongratsShown,
  setProfileCountry
};

const getLocation = state => state.location;
const wasCongratsShown = state => state.congratsShown;
const getCachedLocation = state => state.cachedLocation;
const getProfile = state => state.profile;
const getProfileCountry = state => getProfile(state).country;

export const selectors = {
  getLocation,
  wasCongratsShown,
  getCachedLocation,
  getProfile,
  getProfileCountry,
};
