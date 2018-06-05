import Immutable from 'immutable';

import { PROGRESS_ACTION } from '../types/app';
import {
  FETCH_DATASETS_SUCCESS,
} from '../actions/app';

import { createReducer } from '../helpers/createReducer';


export const initialState = Immutable.Map(
  {
    progress: undefined,
    datasetUUID: undefined,
    error: undefined,
  });

const handlers = {
  [PROGRESS_ACTION]: (state, { progress }) => {
    return state.withMutations(mState => mState
      .set('progress', progress),
    );
  },
  [FETCH_DATASETS_SUCCESS]: (state, { payload }) => {
    return state.withMutations(mState => mState
      .set('datasetUUID', payload),
    );
  },
};

export default createReducer(initialState, handlers);
