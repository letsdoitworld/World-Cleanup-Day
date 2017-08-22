import types from './types';

const INITIAL_STATE = {
  showModal: false,
  locationRead: false,
  locationPermissionGranted: false,
  locationActive: false,
  userLocation: { latitude: 59.4398, longitude: 24.7289 },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.UPDATE_USER_LOCATION:
      return { ...state, userLocation: action.location, locationRead: true };
    case types.SET_LOCATION_PERMISSION:
      return { ...state, locationPermissionGranted: action.payload };
    case types.SET_LOCATION_ACTIVE:
      return { ...state, locationActive: action.payload };
    case types.SET_SHOW_MODAL:
      return { ...state, showModal: action.payload };
    default:
      return state;
  }
};
