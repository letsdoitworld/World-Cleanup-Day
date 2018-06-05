import {
  SEARCH_TRASH_POINTS_ACTION,
  SEARCH_TRASH_POINTS_ERROR_ACTION,
  SEARCH_TRASH_POINTS_SUCCESS_ACTION,
  CLEAR_TRASH_POINTS_ACTION,
  CREATE_TRASH_POINT_ACTION,
  CREATE_TRASH_POINT_SUCCESS_ACTION,
  CREATE_TRASH_POINT_ERROR_ACTION,
  SHOW_NEW_DELTA_TRASH_POINTS_MAP_ACTION,
  LOAD_TRASH_POINTS_FOR_MAP_SUCCESS_ACTION,
  LOAD_TRASH_POINTS_FOR_MAP_ERROR_ACTION,
  LOAD_TRASH_POINT_FROM_CLUSTER_ACTION,
  REQUEST_TRASH_POINTS_MAP_ACTION,
  IS_TRASH_POINTS_EMPTY,
} from '../types/trashPoints';

export const searchTrashPointsAction = (query, page, pageSize, location) => ({
  type: SEARCH_TRASH_POINTS_ACTION,
  payload: {
    query,
    page,
    pageSize,
    location,
  },
});

export const searchTrashPointsSuccessAction = (trashPoints, page, pageSize) => ({
  type: SEARCH_TRASH_POINTS_SUCCESS_ACTION,
  payload: {
    trashPoints,
    page,
    pageSize,
  },
});

export const searchTrashPointsErrorAction = error => ({
  type: SEARCH_TRASH_POINTS_ERROR_ACTION,
  patload: error,
});

export const clearTrashPointsAction = () => ({
  type: CLEAR_TRASH_POINTS_ACTION,
});

export const createTrashPointAction = (
  hashtags,
  composition,
  location,
  status,
  address,
  amount,
  name,
  photos,
) => ({
  type: CREATE_TRASH_POINT_ACTION,
  payload: {
    hashtags,
    composition,
    location,
    status,
    address,
    amount,
    name,
    photos,
  },
});

export const createTrashPointSuccessAction = trashPoint => ({
  type: CREATE_TRASH_POINT_SUCCESS_ACTION,
  payload: trashPoint,
});

export const createTrashPointErrorAction = error => ({
  type: CREATE_TRASH_POINT_ERROR_ACTION,
  payload: error,
});

export const showNewTrashPointsDeltaAction = newDelts => ({
  type: SHOW_NEW_DELTA_TRASH_POINTS_MAP_ACTION,
  payload: newDelts,
});

// /////map

export const loadTrashPointsForMapAction = parameters => ({
  type: REQUEST_TRASH_POINTS_MAP_ACTION,
  payload: parameters,
});

export const loadTrashPointsForMapSuccess = mapEvents => ({
  type: LOAD_TRASH_POINTS_FOR_MAP_SUCCESS_ACTION,
  payload: mapEvents,
});

export const loadTrashPointsForMapError = error => ({
  type: LOAD_TRASH_POINTS_FOR_MAP_ERROR_ACTION,
  payload: error,
});

export const loadTrashPointsFromClusterAction = parameters => ({
  type: LOAD_TRASH_POINT_FROM_CLUSTER_ACTION,
  payload: parameters,
});

export const isTrashPointEmpty = parameters => ({
  type: IS_TRASH_POINTS_EMPTY,
  payload: parameters,
});
