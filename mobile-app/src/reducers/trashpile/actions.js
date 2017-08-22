import types from './types';

const resetMarkerDetails = () => ({ type: types.RESET_MARKER_DETAILS });

const setGridValue = (gridValue) => ({type: types.SET_GRID_VALUE, gridValue});

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
export default {
  resetMarkerDetails,
  fetchUserTrashpoints,
  fetchUserTrashpointsSuccess,
  fetchUserTrashpointsError,
  setGridValue,
};
