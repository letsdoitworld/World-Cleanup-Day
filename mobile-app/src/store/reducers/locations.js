import Immutable from 'immutable';

import { createReducer } from '../helpers/createReducer';

import { LOGOUT } from '../actions/auth';

import {
  FETCH_USER_LOCATION_SUCCESS,
  FETCH_USER_LOCATION_ERROR,
} from '../actions/locations';


export const initialState = Immutable.Map(
  {
    userLocation: null,
    errors: null,
  },
);

const handlers = {
  [LOGOUT]: () => initialState,

  [FETCH_USER_LOCATION_SUCCESS]: (state, { payload }) => {
    return state.withMutations(mState =>
      mState.set('userLocation', payload));
  },
  [FETCH_USER_LOCATION_ERROR]: (state, { payload }) => {
    return state.withMutations(mState =>
      mState.set('errors', payload));
  },
};

export default createReducer(initialState, handlers);
