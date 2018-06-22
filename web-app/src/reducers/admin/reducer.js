import { combineReducers } from 'redux';

import TYPES from './types';

import { types } from '../areas';

const USERS_STATE = {
  users: [],
  canLoadMore: true,
  loading: false,
  error: false,
  showUserslistWindow: true,
};

const usersReducer = (state = USERS_STATE, action) => {
  switch (action.type) {
    case TYPES.FETCH_USERS_REQUEST:
      return { ...state, loading: true, error: false };
    case TYPES.FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload.isSearch ?
          (action.payload.isLoadingMore ? [...state.users, ...action.payload.users] : action.payload.users) :
          (action.payload.reset ? [] : state.users).concat(action.payload.users),
        canLoadMore: action.payload.canLoadMore,
        error: false,
        total: action.payload.total
      };
    case TYPES.FETCH_USERS_FAILED:
      return { ...state, loading: false, error: true };
    case TYPES.SET_USER_LOCKED: {
      const users = state.users;
      const userIndex = users.findIndex(u => u.id === action.payload.userId);
      const updatedUser = {
        ...users[userIndex],
        locked: action.payload.locked,
      };
      const newUsers = [
        ...users.slice(0, userIndex),
        updatedUser,
        ...users.slice(userIndex + 1),
      ];
      return { ...state, users: newUsers };
    }
    case TYPES.RESET_USERS:
      return { ...state, users: [] };
    case types.ASSIGN_AREA_LEADER: {
      return {
        ...state,
        users: state.users.map(u => {
          if (u.id === action.payload.userId) {
            return {
              ...u,
              role: 'leader',
            };
          }
          return u;
        }),
      };
    }
    case TYPES.TOGGLE_USERSLIST_WINDOW: {
      return { ...state, showUserslistWindow: !state.showUserslistWindow };
    }
    default:
      return state;
  }
};

const USER_STATE = {
  user: undefined,
  loading: false,
  error: false,
};

const userReducer = (state = USER_STATE, action) => {
  switch (action.type) {
    case TYPES.GET_USER:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case TYPES.GET_USER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        loading: false,
        error: false,
      };
    case TYPES.GET_USER_ERROR:
      return {
        ...state,
        user: undefined,
        loading: false,
        error: true,
      };
    case TYPES.SET_USER_LOCKED: {
      if (!state.user || action.payload.userId !== state.user.id) {
        return state;
      }
      return {
        ...state,
        user: {
          ...state.user,
          locked: action.payload.locked,
        },
      };
    }
    default:
      return state;
  }
};

export default combineReducers({
  users: usersReducer,
  user: userReducer,
});
