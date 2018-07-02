import { ApiService } from '../../services';
import { API_ENDPOINTS } from '../../shared/constants';
import TYPES from './types';
import { actions as errorActions } from '../error';

const fetchUsers = ({
  page,
  pageSize,
  reset,
  area,
  nameSearch,
  isLoadingMore,
}) => async dispatch => {
  dispatch({ type: TYPES.FETCH_USERS_REQUEST });
  try {
    const requestParams = userRole => ({
      page,
      pageSize,
      area,
      nameSearch,
      userRole,
    });

    const adminUrl = API_ENDPOINTS.FETCH_USERS(requestParams('admin'));
    const volunteerUrl = API_ENDPOINTS.FETCH_USERS(requestParams('volunteer'));

    const [adminResponse, volunteerRes] = await Promise.all([
      ApiService.get(adminUrl),
      ApiService.get(volunteerUrl),
    ]);

    if (
      !adminResponse ||
      !volunteerRes
    ) {
      dispatch({
        type: TYPES.FETCH_USERS_FAILED,
      });
      dispatch(errorActions.setErrorMessage('Failed to load users list'));
      return false;
    }

    const data = volunteerRes.data;
    const users = [...adminResponse.data.records, ...volunteerRes.data.records];
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
    dispatch(errorActions.setErrorMessage('Failed to load users list'));
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
    dispatch(errorActions.setErrorMessage('Failed to load user details'));
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
