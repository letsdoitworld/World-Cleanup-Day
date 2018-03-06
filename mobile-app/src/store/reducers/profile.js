import Immutable from 'immutable';

import { createReducer } from '../helpers/createReducer';

import {
  TERMS_AGREE,
  FETCH_PROFILE,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_ERROR,
  UPDATE_PROFILE,
  UPDATE_PROFILE_DONE,
  UPDATE_PROFILE_ERROR,
} from '../actions/profile';


export const initialState = Immutable.Map(
  {
    entity: null,
    loading: false,
    updating: false,
    updatingError: null,
    error: null,
  },
);


const handlers = {
  [TERMS_AGREE]: (state) => {
    return state.withMutations(
      state.set('entity', {
        ...state.entity,
        termsAcceptedAt: true,
      }),
    );
  },
  [FETCH_PROFILE]: (state) => {
    console.log('FETCH_PROFILE', state);
    return state.withMutations(mState =>
      mState.set('loading', true));
  },
  [FETCH_PROFILE_SUCCESS]: (state, { payload }) => {
    console.log('FETCH_PROFILE_SUCCESS', payload);
    return state.withMutations(mState =>
      mState.set('entity', payload));
  },
  [FETCH_PROFILE_ERROR]: (state, { payload }) => {
    return state.withMutations(mState =>
      mState.set('error', payload));
  },
  [UPDATE_PROFILE]: (state) => {
    return state.withMutations(mState =>
      mState.set('updating', true));
  },
  [UPDATE_PROFILE_DONE]: (state, { payload }) => {
    return state.withMutations(mState =>
      mState
        .set('updating', false)
        .set('updatingError', null)
        .set('entity', payload),
      );
  },
  [UPDATE_PROFILE_ERROR]: (state, { payload }) => {
    return state.withMutations(mState =>
      mState
        .set('updating', false)
        .set('updatingError', payload),
    );
  },
};

export default createReducer(initialState, handlers);
