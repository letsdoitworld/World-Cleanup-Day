import {
  CLEAR_TRASH_POINTS_ACTION,
  CREATE_TRASH_POINT_ACTION,
  CREATE_TRASH_POINT_ERROR_ACTION,
  CREATE_TRASH_POINT_SUCCESS_ACTION,
  GET_TRASH_POINT_DETAILS_ACTION,
  GET_TRASH_POINT_DETAILS_SUCCESS_ACTION,
  DELETE_TRASH_POINT_IMAGE_ACTION,
  DELETE_TRASH_POINT_IMAGE_SUCCESS_ACTION,
  DISMISS_SUCCESS_UPDATE,
  GET_TRASH_POINT_IMAGES_ACTION,
  GET_TRASH_POINT_IMAGES_SUCCESS_ACTION,
  IS_TRASH_POINTS_EMPTY,
  LOAD_TRASH_POINT_FROM_CLUSTER_ACTION,
  LOAD_TRASH_POINTS_FOR_MAP_ERROR_ACTION,
  LOAD_TRASH_POINTS_FOR_MAP_SUCCESS_ACTION,
  REQUEST_TRASH_POINTS_MAP_ACTION,
  LOAD_TRASH_POINT_SUCCESS,
  LOAD_TRASH_POINT,
  CLEAN_TRASH_POINT,
  SEARCH_TRASH_POINTS_ACTION,
  SEARCH_TRASH_POINTS_ERROR_ACTION,
  SEARCH_TRASH_POINTS_SUCCESS_ACTION,
  SHOW_NEW_DELTA_TRASH_POINTS_MAP_ACTION,
  UPDATE_TRASH_POINT_ACTION,
  TRASH_POINT_DETAILS_SUCCESS,
  DELETE_TRASH_POINT_ACTION,
  DELETE_TRASH_POINT_SUCCESS_ACTION,
  CLEAN_TRASH_POINT_DETAILS,
  CLEAN_TRASH_POINT_IMAGE_DETAILS,
  GET_TRASH_POINT_ORIGIN_ACTION, UPDATE_TRASH_POINT_SUCCESS_ACTION,
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
export const loadTrashPoint = data => ({
  type: LOAD_TRASH_POINT,
  payload: data,
});

export const cleanTrashPoint = () => ({
  type: CLEAN_TRASH_POINT,
});

export const loadTrashPointSuccess = data => ({
  type: LOAD_TRASH_POINT_SUCCESS,
  payload: data,
});

export const searchTrashPointsErrorAction = error => ({
  type: SEARCH_TRASH_POINTS_ERROR_ACTION,
  patload: error,
});

export const clearTrashPointsAction = () => ({
  type: CLEAR_TRASH_POINTS_ACTION,
});

export const getTrashPointDetailsAction = () => ({
  type: GET_TRASH_POINT_DETAILS_ACTION,
});

export const getTrashPointOriginAction = () => ({
  type: GET_TRASH_POINT_ORIGIN_ACTION,
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
  trashOrigins,
  team,
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
    trashOrigins,
    team,
  },
});

export const updateTrashPointAction = (
  id,
  hashtags,
  composition,
  location,
  status,
  address,
  amount,
  name,
  photos,
  deletedIds,
  trashOrigins,
) => ({
  type: UPDATE_TRASH_POINT_ACTION,
  payload: {
    id,
    hashtags,
    composition,
    location,
    status,
    address,
    amount,
    name,
    photos,
    deletedIds,
    trashOrigins,
  },
});

export const deleteTrashPointImageAction = (trashPointId, id) => ({
  type: DELETE_TRASH_POINT_IMAGE_ACTION,
  payload: {
    trashPointId,
    id,
  },
});

export const dismissSuccessUpdate = () => ({
  type: DISMISS_SUCCESS_UPDATE,
  payload: {
  },
});

export const deleteTrashPointImageActionSuccess = id => ({
  type: DELETE_TRASH_POINT_IMAGE_SUCCESS_ACTION,
  payload: {
    id,
  },
});

export const getTrashPointImagesAction =
  id => ({
    type: GET_TRASH_POINT_IMAGES_ACTION,
    payload: {
      id,
    },
  });

export const getTrashPointImagesSuccessAction =
  images => ({
    type: GET_TRASH_POINT_IMAGES_SUCCESS_ACTION,
    payload: {
      images,
    },
  });

export const deleteTrashPointAction = id => ({
  type: DELETE_TRASH_POINT_ACTION,
  payload: {
    id,
  },
});

export const getTrashPointDetailsSuccessAction = details => ({
  type: GET_TRASH_POINT_DETAILS_SUCCESS_ACTION,
  payload: details,
});

export const updateTrashPointSuccessAction = trashPoint => ({
  type: UPDATE_TRASH_POINT_SUCCESS_ACTION,
  payload: trashPoint,
});

export const createTrashPointSuccessAction = trashPoint => ({
  type: CREATE_TRASH_POINT_SUCCESS_ACTION,
  payload: trashPoint,
});

export const deleteTrashPointSuccessAction = id => ({
  type: DELETE_TRASH_POINT_SUCCESS_ACTION,
  payload: { id },
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

export const getTrashPointAction = id => ({
  type: GET_TRASH_POINT_DETAILS_ACTION,
  payload: id,
});

export const getTrashPointSuccess = trashpoint => ({
  type: TRASH_POINT_DETAILS_SUCCESS,
  payload: trashpoint,
});

export const clearTrashPointDetails = () => ({
  type: CLEAN_TRASH_POINT_DETAILS,
});

export const clearTrashPointImagesDetails = () => ({
  type: CLEAN_TRASH_POINT_IMAGE_DETAILS,
});

