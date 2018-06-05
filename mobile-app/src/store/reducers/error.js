import Immutable from 'immutable';

import {
  SET_ERROR_MESSAGE,
} from '../actions/error';

import { createReducer } from '../helpers/createReducer';


export const initialState = Immutable.Map(
  {
    error: undefined,
  });

const handlers = {
  [SET_ERROR_MESSAGE]: (state, { payload }) => {
    const currentError = state.get('error');
    if (currentError !== payload) {
      return state.withMutations(mState => mState
        .set('error', payload),
      );
    }
    return state;
  },
};

export default createReducer(initialState, handlers);
