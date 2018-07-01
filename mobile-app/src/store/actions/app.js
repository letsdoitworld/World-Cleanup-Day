import {
  SET_CONNECTION_CHECKED,
  UPDATE_NETWORK_STATUS,
  UPDATE_LACK_CONNECTION_MESSAGE_STATUS,
  UPDATE_SYNC_STATUS,
} from '../types/app';

export const SET_ACTIVE_SCREEN = 'SET_ACTIVE_SCREEN';
export const setActiveScreen = activeScreen => ({
  type: SET_ACTIVE_SCREEN,
  activeScreen,
});

const PROGRESS_ACTION = 'PROGRESS_ACTION';
export const controlProgress = progress => ({
  type: PROGRESS_ACTION,
  progress,
});

export const FETCH_DATASETS_REQUEST = 'FETCH_DATASETS_REQUEST';
export const fetchDatasetUIIDAction = () => ({
  type: FETCH_DATASETS_REQUEST,
});

export const FETCH_DATASETS_SUCCESS = 'FETCH_DATASETS_SUCCESS';
export const fetchDatasetUIIDSuccsess = datasetId => ({
  type: FETCH_DATASETS_SUCCESS,
  payload: datasetId,
});

export const FETCH_DATASETS_FAILED = 'FETCH_DATASETS_FAILED';
export const fetchDatasetUIIDError = error => ({
  type: FETCH_DATASETS_SUCCESS,
  error,
});

export const setConnectionChecked = () => ({ type: SET_CONNECTION_CHECKED });
export const updateNetworkStatus = isConnected =>
  ({ type: UPDATE_NETWORK_STATUS, payload: { isConnected } });
export const updateSyncStatus = inSync =>
  ({ type: UPDATE_SYNC_STATUS, payload: { inSync } });
export const updateLackConnMessStatus = noLackConnectionAlert =>
  ({ type: UPDATE_LACK_CONNECTION_MESSAGE_STATUS, payload: { noLackConnectionAlert } });
