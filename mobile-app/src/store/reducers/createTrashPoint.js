import Immutable from 'immutable';

import {
  CREATE_TRASH_POINT_ERROR_ACTION,
  CREATE_TRASH_POINT_SUCCESS_ACTION,
} from '../types/trashPoints';

import { createReducer } from '../helpers/createReducer';

export const initialState = Immutable.Map(
  {
    success: false,
    error: null,
  });

const handlers = {
  [CREATE_TRASH_POINT_SUCCESS_ACTION]: (state) => {
    return state.withMutations(mState => mState
      .set('success', true)
      .set('error', null),
    );
  },
  [CREATE_TRASH_POINT_ERROR_ACTION]: (state, { error }) => {
    return state.withMutations(mState => mState
      .set('success', false)
      .set('error', error),
    );
  },
};

export default createReducer(initialState, handlers);
