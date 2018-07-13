import Immutable from 'immutable';

import {
  CLEAR_TRASH_POINTS_ACTION,
  DELETE_TRASH_POINT_SUCCESS_ACTION,
  IS_TRASH_POINTS_EMPTY,
  LOAD_TRASH_POINTS_FOR_MAP_ERROR_ACTION,
  LOAD_TRASH_POINTS_FOR_MAP_SUCCESS_ACTION,
  SEARCH_TRASH_POINTS_SUCCESS_ACTION,
  SHOW_NEW_DELTA_TRASH_POINTS_MAP_ACTION,
  GET_TRASH_POINT_IMAGES_SUCCESS_ACTION,
  TRASH_POINT_DETAILS_SUCCESS,
  CLEAN_TRASH_POINT_DETAILS,
  CLEAN_TRASH_POINT_IMAGE_DETAILS,
} from '../types/trashPoints';

import { createReducer } from '../helpers/createReducer';

export const initialState = Immutable.Map(
  {
    page: undefined,
    pageSize: undefined,
    trashPoints: undefined,
    trashPointDetails: undefined,
    error: undefined,
    mapTrashPoints: undefined,
    newDelta: undefined,
    empty: false,
    trashPointImages: [],
    searchCount: 0,
  });

function removeTrashPoint(trashPoints, trashPointId) {
  const updatedTrashPoints = trashPoints;
  if (!updatedTrashPoints) {
    return trashPoints;
  }
  const removedIndex = updatedTrashPoints
    .findIndex(trashPoint => trashPointId === trashPoint.id);
  updatedTrashPoints.splice(removedIndex, 1);

  return updatedTrashPoints;
}

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
    const currentCount = state.get('searchCount');
    return state.withMutations((mState) => {
      mState.set('mapTrashPoints', payload);
      mState.set('searchCount', currentCount + 1);
    });
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
  [GET_TRASH_POINT_IMAGES_SUCCESS_ACTION]: (state, { payload }) => {
    const photos = Object.values(payload.images).filter(photo => photo.type === 'medium');
    return state.withMutations(mState => mState
      .set('trashPointImages', photos));
  },
  [DELETE_TRASH_POINT_SUCCESS_ACTION]: (state, { payload }) => {
    const { id } = payload;
    const currentTrashPoints = removeTrashPoint(state.get('trashPoints'), id);
    const currentMapTrashPoints = removeTrashPoint(state.get('mapTrashPoints'), id);

    return state.withMutations(mState => mState
      .set('trashPoints', currentTrashPoints)
      .set('trashPointDetails', undefined)
      .set('mapTrashPoints', currentMapTrashPoints),
    );
  },
  [TRASH_POINT_DETAILS_SUCCESS]: (state, { payload }) => {
    return state.withMutations(mState => mState
      .set('trashPointDetails', payload));
  },
  [CLEAN_TRASH_POINT_DETAILS]: (state) => {
    return state.withMutations(mState => mState
      .set('trashPointDetails', undefined),
    );
  },
  [CLEAN_TRASH_POINT_IMAGE_DETAILS]: (state) => {
    return state.withMutations(mState => mState
      .set('trashPointImages', []),
    );
  },
};

export default createReducer(initialState, handlers);
