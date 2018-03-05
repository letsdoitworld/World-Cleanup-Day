import Immutable from 'immutable';
import { createReducer } from '../helpers/createReducer';

import {
  SET_AUTH_TOKEN,
  SET_AUTH_ERROR,
  REMOVE_AUTH_TOKEN,
  // GOOGLE_LOGIN_ACTION,
  // FB_LOGIN_ACTION
} from '../actions/auth';

// export const initialState = {
//   token: null,
//   tokenError: null,
//   termsAgreed: false,
// };

export const initialState = Immutable.Map(
  {
    token: null,
    tokenError: null,
    termsAgreed: false,
  },
);

const handlers = {
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
  [REMOVE_AUTH_TOKEN]: (state) => {
    return state.withMutations(mState =>
      mState.set('token', null),
    );
  },
};

export default createReducer(initialState, handlers);

