
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
