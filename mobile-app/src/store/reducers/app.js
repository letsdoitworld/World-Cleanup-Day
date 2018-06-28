import Immutable from 'immutable';

import {
  PROGRESS_ACTION,
  SET_CONNECTION_CHECKED,
  UPDATE_NETWORK_STATUS,
  UPDATE_LACK_CONNECTION_MESSAGE_STATUS, UPDATE_SYNC_STATUS,
} from '../types/app';
import {
  FETCH_DATASETS_SUCCESS,
} from '../actions/app';

import { createReducer } from '../helpers/createReducer';


export const initialState = Immutable.Map(
  {
    progress: undefined,
    datasetUUID: undefined,
    error: undefined,
    isConnected: false,
    connectionChecked: false,
    noLackConnectionAlert: false,
    inSync: false,
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
  [SET_CONNECTION_CHECKED]: (state) => {
    return state.withMutations(mState => mState
      .set('connectionChecked', true)
    );
  },
  [UPDATE_NETWORK_STATUS]: (state, { payload }) => {
    return state.withMutations(mState => mState
      .set('isConnected', payload.isConnected)
    );
  },
  [UPDATE_SYNC_STATUS]: (state, { payload }) => {
    return state.withMutations(mState => mState
      .set('inSync', payload.inSync)
    );
  },
  [UPDATE_LACK_CONNECTION_MESSAGE_STATUS]: (state, { payload }) => {
    return state.withMutations(mState => mState
      .set('noLackConnectionAlert', payload.noLackConnectionAlert)
    )
  }
};

export default createReducer(initialState, handlers);
