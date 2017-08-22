import types from './types';

const updateUserLocation = location => ({
  type: types.UPDATE_USER_LOCATION,
  location,
});
const setLocationActive = locationActive => ({
  type: types.SET_LOCATION_ACTIVE,
  payload: locationActive,
});
const setLocationPermission = locationPermitted => ({
  type: types.SET_LOCATION_PERMISSION,
  payload: locationPermitted,
});
const setErrorModalVisible = (showModal = true) => ({
  type: types.SET_SHOW_MODAL,
  payload: showModal,
});

export default {
  updateUserLocation,
  setLocationActive,
  setLocationPermission,
  setErrorModalVisible,
};
