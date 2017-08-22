import { ApiService } from '../../services';
import { API_ENDPOINTS } from '../../shared/constants';
import TYPES from './types';

const fetchUsers = () => async dispatch => {
  dispatch({ type: TYPES.FETCH_USERS_REQUEST });
  try {
    const response = await ApiService.get(API_ENDPOINTS.FETCH_USERS);
    if (!response) {
      return dispatch({
        type: TYPES.FETCH_USERS_FAILED,
      });
    }

    const users = Array.isArray(response.data) ? response.data : [];

    dispatch({
      type: TYPES.FETCH_USERS_SUCCESS,
      users,
    });
  } catch (e) {
    console.log(e);
    return dispatch({
      type: TYPES.FETCH_USERS_FAILED,
    });
  }
};

const fetchUser = ({ id }) => async dispatch => {
  dispatch({ type: TYPES.GET_USER });
  try {
    const response = await ApiService.get(API_ENDPOINTS.FETCH_USER_BY_ID(id));
    if (!response) {
      dispatch({ type: TYPES.GET_USER_ERROR });
    } else {
      dispatch({
        type: TYPES.GET_USER_SUCCESS,
        payload: { user: response.data },
      });
    }
  } catch (ex) {
    dispatch({ type: TYPES.GET_USER_ERROR });
  }
};

const setUserLocked = (userId, locked) => async dispatch => {
  const response = await ApiService.put(API_ENDPOINTS.LOCK_USER(userId), {
    locked,
  });
  if (!response) {
    return;
  }
  dispatch({
    type: TYPES.SET_USER_LOCKED,
    payload: {
      userId,
      locked,
    },
  });
};

export default {
  fetchUsers,
  fetchUser,
  setUserLocked,
};
