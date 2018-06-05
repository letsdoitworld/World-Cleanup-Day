import Immutable from 'immutable';

import {
  SEARCH_TRASH_POINTS_SUCCESS_ACTION,
  CLEAR_TRASH_POINTS_ACTION,
  SHOW_NEW_DELTA_TRASH_POINTS_MAP_ACTION,
  LOAD_TRASH_POINTS_FOR_MAP_SUCCESS_ACTION,
  LOAD_TRASH_POINTS_FOR_MAP_ERROR_ACTION,
  IS_TRASH_POINTS_EMPTY,
} from '../types/trashPoints';

import { createReducer } from '../helpers/createReducer';

export const initialState = Immutable.Map(
  {
    page: undefined,
    pageSize: undefined,
    trashPoints: undefined,
    error: undefined,
    mapTrashPoints: undefined,
    newDelta: undefined,
    empty: false,
  });

const handlers = {
  [SEARCH_TRASH_POINTS_SUCCESS_ACTION]: (state, { payload }) => {
    const { page, trashPoints } = payload;
    if (page > 0) {
      const currentTrashPoints = state.get('trashPoints');
      if (currentTrashPoints) {
        return state.withMutations(mState => mState
          .set('trashPoints', currentTrashPoints.concat(trashPoints)));
      }
    } else {
      return state.withMutations(mState => mState
        .set('trashPoints', trashPoints));
    }
  },
  [CLEAR_TRASH_POINTS_ACTION]: (state) => {
    return state.withMutations(mState => mState
      .set('trashPoints', undefined),
    );
  },
  [LOAD_TRASH_POINTS_FOR_MAP_SUCCESS_ACTION]: (state, { payload }) => {
    return state.withMutations(mState => mState
      .set('mapTrashPoints', payload));
  },
  [LOAD_TRASH_POINTS_FOR_MAP_ERROR_ACTION]: (state, { payload }) => {
    return state.withMutations(mState => mState
      .set('error', payload));
  },
  [SHOW_NEW_DELTA_TRASH_POINTS_MAP_ACTION]: (state, { payload }) => {
    return state.withMutations(mState => mState
      .set('newDelta', payload));
  },
  [IS_TRASH_POINTS_EMPTY]: (state, { payload }) => {
    return state.withMutations(mState => mState
      .set('empty', payload));
  },
};

export default createReducer(initialState, handlers);
