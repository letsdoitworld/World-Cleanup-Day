export const FETCH_USER_LOCATION = 'profile/FETCH_USER_LOCATION';
export const fetchUserLocation = coord => ({
  type: FETCH_USER_LOCATION,
  payload: coord,
});

export const FETCH_USER_LOCATION_SUCCESS = 'profile/FETCH_USER_LOCATION_SUCCESS';
export const fetchUserLocationDone = location => ({
  type: FETCH_USER_LOCATION_SUCCESS,
  payload: location,
});

export const FETCH_USER_LOCATION_ERROR = 'profile/FETCH_USER_LOCATION_ERROR';
export const fetchUserLocationError = error => ({
  type: FETCH_USER_LOCATION_ERROR,
  payload: error,
});
