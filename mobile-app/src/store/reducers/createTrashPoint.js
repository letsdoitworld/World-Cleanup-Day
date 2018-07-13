import Immutable from 'immutable';

import {
  CREATE_TRASH_POINT_ERROR_ACTION,
  CREATE_TRASH_POINT_SUCCESS_ACTION,
  GET_TRASH_POINT_DETAILS_SUCCESS_ACTION,
  DISMISS_SUCCESS_UPDATE,
  UPDATE_TRASH_POINT_SUCCESS_ACTION,
} from '../types/trashPoints';

import { createReducer } from '../helpers/createReducer';

export const initialState = Immutable.Map(
  {
    success: false,
    error: null,
    updatedTrashPoint: null,
    trashpointCompositions: null,
    trashpointOrigins: null,
  });

function mapStringToTagObject(type: string) {
  const label = type.charAt(0).toUpperCase() + type.substr(1);

  return {
    type,
    label,
  };
}

const handlers = {
  [CREATE_TRASH_POINT_SUCCESS_ACTION]: (state, { payload }) => {
    return state.withMutations(mState => mState
      .set('success', true)
      .set('error', null)
      .set('updatedTrashPoint', payload),
    );
  },
  [UPDATE_TRASH_POINT_SUCCESS_ACTION]: (state, { payload }) => {
    return state.withMutations(mState => mState
      .set('success', true)
      .set('error', null)
      .set('updatedTrashPoint', payload),
    );
  },
  [CREATE_TRASH_POINT_ERROR_ACTION]: (state, { error }) => {
    return state.withMutations(mState => mState
      .set('success', false)
      .set('error', error),
    );
  },
  [GET_TRASH_POINT_DETAILS_SUCCESS_ACTION]: (state, { payload }) => {
    const trashPointOrigins = payload.trashpointOrigins
      .map(mapStringToTagObject);
    const trashpointCompositions = payload.trashpointCompositions
      .map(mapStringToTagObject);

    return state.withMutations(mState => mState
      .set('trashpointCompositions', trashpointCompositions)
      .set('trashpointOrigins', trashPointOrigins),
    );
  },
  [DISMISS_SUCCESS_UPDATE]: (state) => {
    return state.withMutations(mState => mState
      .set('success', false),
    );
  },
};

export default createReducer(initialState, handlers);
