import { ApiService } from '../../services';
import { API_ENDPOINTS } from '../../shared/constants';
import TYPES from './types';

const fetchUsers = ({ page, pageSize, reset, area, nameSearch, isLoadingMore }) => async dispatch => {
  dispatch({ type: TYPES.FETCH_USERS_REQUEST });
  try {
    const url = API_ENDPOINTS.FETCH_USERS({ page, pageSize, area, nameSearch });
    const response = await ApiService.get(url);
    if (
      !response ||
      !response.data ||
      !response.status ||
      response.status !== 200
    ) {
      dispatch({
        type: TYPES.FETCH_USERS_FAILED,
      });
      return false;
    }
    const data = response.data;
    const users = Array.isArray(data.records) ? data.records : [];
    const total = data.total;
    const canLoadMore = data.pageSize * data.pageNumber < total;

    dispatch({
      type: TYPES.FETCH_USERS_SUCCESS,
      payload: {
        page: data.pageNumber,
        users,
        reset,
        canLoadMore,
        total,
        isSearch: !!nameSearch,
        isLoadingMore,
      },
    });
    return {
      page,
      users,
      reset,
      canLoadMore,
      total,
    };
  } catch (e) {
    console.log(e);
    dispatch({
      type: TYPES.FETCH_USERS_FAILED,
    });
    return false;
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

const toggleUserslistWindow = () => dispatch => {
  dispatch({
    type: TYPES.TOGGLE_USERSLIST_WINDOW,
  });
};

const resetUsers = () => ({ type: TYPES.RESET_USERS });

export default {
  fetchUsers,
  fetchUser,
  setUserLocked,
  resetUsers,
  toggleUserslistWindow,
};
