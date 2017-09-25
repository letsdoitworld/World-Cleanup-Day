import types from './types';

const resetMarkerDetails = () => ({ type: types.RESET_MARKER_DETAILS });

const setLastDelta = delta => ({ type: types.SET_GRID_VALUE, delta });

const fetchUserTrashpoints = ({ reset } = {}) => ({
  type: types.FETCH_USER_TRASHPOINTS_REQUEST,
  payload: {
    reset,
  },
});
const fetchUserTrashpointsSuccess = (
  { trashpoints, endReached = false, reset } = {},
) => ({
  type: types.FETCH_USER_TRASHPOINTS_SUCCESS,
  payload: {
    trashpoints,
    endReached,
    reset,
  },
});
const fetchUserTrashpointsError = () => ({
  type: types.FETCH_USER_TRASHPOINTS_FAILED,
});

const deleteMarker = () => ({
  type: types.DELETE_MARKER,
});
const deleteMarkerSuccess = ({ markerId }) => ({
  type: types.DELETE_MARKER_SUCCESS,
  payload: {
    markerId,
  },
});
const deleteMarkerError = () => ({
  type: types.DELETE_MARKER_ERROR,
});

export default {
  resetMarkerDetails,
  fetchUserTrashpoints,
  fetchUserTrashpointsSuccess,
  fetchUserTrashpointsError,
  setLastDelta,

  deleteMarker,
  deleteMarkerSuccess,
  deleteMarkerError,
};
