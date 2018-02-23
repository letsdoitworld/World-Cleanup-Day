//import { combineReducers } from 'redux';

import types from './types';

export const authInitialState = {
  token: 'Ihor kakaha',
  tokenError: undefined,
  termsAgreed: false,
};

export const profileInitialState = {
  entity: undefined,
  loading: false,
  updating: false,
  updatingError: undefined,
  error: undefined,
};

export const authReducer = (state = authInitialState, action) => {
  switch (action.type) {
    case types.SET_AUTH_TOKEN:
      return { ...state, token: action.payload };
    case types.SET_AUTH_ERROR:
      return { ...state, tokenError: String(action.payload) };
    case types.REMOVE_AUTH_TOKEN:
      return { ...state, token: undefined };
    default:
      return state;
  }
};

export const profileReducer = (state = profileInitialState, action) => {
  switch (action.type) {
    case types.TERMS_AGREE:
      return {
        ...state,
        entity: {
          ...state.entity,
          termsAcceptedAt: true,
        },
      };
    case types.FETCH_PROFILE:
      return {
        ...state,
        loading: true,
      };
    case types.FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: undefined,
        entity: action.payload,
      };
    case types.FETCH_PROFILE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.UPDATE_PROFILE:
      return {
        ...state,
        updating: true,
        updatingError: undefined,
      };
    case types.UPDATE_PROFILE_DONE:
      return {
        ...state,
        updating: false,
        updatingError: undefined,
        entity: action.payload,
      };
    case types.UPDATE_PROFILE_ERROR:
      return {
        ...state,
        updating: false,
        updatingError: action.payload,
      };

    default:
      return state;
  }
};

// export default {
//     authInitialState,
//     profileInitialState,
//     authReducer,
//     profileReducer
// }
//
// export default combineReducers({
//   auth: authReducer,
//   profile: profileReducer,
// });
