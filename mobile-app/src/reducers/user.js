const SET_USER_LOCATION = 'SET_USER_LOCATION';
const SET_CACHED_LOCATION = 'SET_CACHED_LOCATION';

const INITIAL_STATE = {
  location: {
    latitude: null,
    longitude: null,
  },
  cachedLocation: {
    latitude: null,
    longitude: null,
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_USER_LOCATION:
      return { ...state, location: action.location };
    case SET_CACHED_LOCATION:
      return { ...state, cachedLocation: action.cachedLocation };
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

export const actions = {
  setUserLocation,
  setCachedLocation,
};

const getLocation = (state) => {
  return state.location;
};

export const selectors = {
  getLocation,
};
