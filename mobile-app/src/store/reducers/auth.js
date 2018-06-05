import Immutable from 'immutable';
import { createReducer } from '../helpers/createReducer';

import {
  SET_AUTH_TOKEN,
  SET_AUTH_ERROR,
  SET_GUEST_SESSION,
  GUEST_LOG_IN,
  LOGOUT,
  SET_TERMS_ACCEPTED,
  REQUEST_TERMS_ACCEPT,
} from '../actions/auth';


export const initialState = Immutable.Map(
  {
    token: null,
    tokenError: null,
    termsAgreed: false,
    isGuestSession: false,
  },
);

const handlers = {
  [LOGOUT]: () => initialState,
  [GUEST_LOG_IN]: () => initialState,
  [SET_AUTH_TOKEN]: (state, { payload }) => {
    return state.withMutations(mState =>
      mState.set('token', payload),
    );
  },
  [SET_AUTH_ERROR]: (state, { payload }) => {
    return state.withMutations(mState =>
      mState.set('tokenError', String(payload)),
    );
  },
  [SET_GUEST_SESSION]: (state) => {
    return state.withMutations(mState =>
      mState.set('isGuestSession', true),
    );
  },
  [SET_TERMS_ACCEPTED]: (state, { payload }) => {
    return state.withMutations(mState =>
      mState.set('termsAgreed', payload),
    );
  },
  [REQUEST_TERMS_ACCEPT]: (state) => {
    return state.withMutations(mState =>
      mState.set('termsAgreed', true),
    );
  },
};

export default createReducer(initialState, handlers);

