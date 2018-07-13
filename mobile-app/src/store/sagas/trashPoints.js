import {
  call,
  put,
  take,
} from 'redux-saga/effects';
import isEmpty from 'lodash/isEmpty';
import {
  CREATE_TRASH_POINT_ACTION,
  GET_TRASH_POINT_DETAILS_ACTION,
  DELETE_TRASH_POINT_ACTION,
  DELETE_TRASH_POINT_IMAGE_ACTION,
  GET_TRASH_POINT_IMAGES_ACTION,
  LOAD_TRASH_POINT_FROM_CLUSTER_ACTION,
  REQUEST_TRASH_POINTS_MAP_ACTION,
  SEARCH_TRASH_POINTS_ACTION,
  UPDATE_TRASH_POINT_ACTION, GET_TRASH_POINT_ORIGIN_ACTION,
} from '../types/trashPoints';
import { controlProgress } from '../actions/app';
import { setErrorMessage } from '../actions/error';
import {
  createTrashPointSuccessAction,
  deleteTrashPointSuccessAction,
  isTrashPointEmpty,
  loadTrashPointsForMapSuccess,
  searchTrashPointsSuccessAction,
  showNewTrashPointsDeltaAction,
  getTrashPointImagesSuccessAction,
  deleteTrashPointImageActionSuccess,
  getTrashPointSuccess,
  getTrashPointDetailsSuccessAction,
  createTrashPointErrorAction,
  updateTrashPointSuccessAction
} from '../actions/trashPoints';
import Api from '../../api';

function* searchTrashPoints(query, page, pageSize, location) {
  try {
    const response = yield call(
      Api.trashPoints.searchTrashPointsRequest,
      query,
      page,
      pageSize,
      location,
    );
    yield put(searchTrashPointsSuccessAction(response.data.records, page, pageSize));
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}

export function* searchTrashPointsFlow() {
  while (true) {
    const { payload } = yield take(SEARCH_TRASH_POINTS_ACTION);
    const { query, page, pageSize, location } = payload;
    yield put(controlProgress(true));
    yield call(searchTrashPoints, query, page, pageSize, location);
    yield put(controlProgress(false));
  }
}

function* createTrashPoint(
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
) {
  try {
    const response = yield call(
      Api.trashPoints.createTrashPointRequest,
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
    );

    if (response.data) {
      yield put(createTrashPointSuccessAction(response.data.trashpoint));
    } else {
      yield put(setErrorMessage('No response data '));
    }
  } catch (error) {
    yield put(createTrashPointErrorAction(error.message));
    yield put(setErrorMessage(error.message));
  }
}


export function* createTrashPointFlow() {
  while (true) {
    const { payload } = yield take(CREATE_TRASH_POINT_ACTION);
    const {
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
    } = payload;
    yield put(controlProgress(true));
    yield call(
      createTrashPoint,
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
    );
    yield put(controlProgress(false));
  }
}

function* deleteTrashPointImage(
  trashPointId,
  id,
) {
  try {
    const response = yield call(
      Api.trashPoints.deleteTrashPointPhotoRequest,
      trashPointId,
      id,
    );

    if (response.data) {
      yield put(deleteTrashPointImageActionSuccess(id));
    } else {
      yield put(setErrorMessage('No response data '));
    }
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}


export function* deleteTrashPointImageFlow() {
  while (true) {
    const { payload } = yield take(DELETE_TRASH_POINT_IMAGE_ACTION);

    const {
      trashPointId,
      id,
    } = payload;
    yield put(controlProgress(true));
    yield call(
      deleteTrashPointImage,
      trashPointId,
      id,
    );
    yield put(controlProgress(false));
  }
}

function* updateTrashPoint(
  id,
  hashtags,
  composition,
  location,
  status,
  address,
  amount,
  name,
  photos,
  trashOrigins,
) {
  try {
    const response = yield call(
      Api.trashPoints.updateTrashPointRequest,
      id,
      hashtags,
      composition,
      location,
      status,
      address,
      amount,
      name,
      photos,
      trashOrigins,
    );

    if (response.data) {
      yield put(updateTrashPointSuccessAction(response.data.trashpoint));
    } else {
      yield put(setErrorMessage('No response data '));
    }
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}


export function* updateTrashPointFlow() {
  while (true) {
    const { payload } = yield take(UPDATE_TRASH_POINT_ACTION);

    const {
      id,
      hashtags,
      composition,
      location,
      status,
      address,
      amount,
      name,
      photos,
      trashOrigins,
    } = payload;
    yield put(controlProgress(true));
    yield call(
      updateTrashPoint,
      id,
      hashtags,
      composition,
      location,
      status,
      address,
      amount,
      name,
      photos,
      trashOrigins,
    );
    yield put(controlProgress(false));
  }
}

function* getTrashPointDetails() {
  try {
    const response = yield call(
      Api.trashPoints.getTrashPointDetailsRequest,
    );

    if (response.data) {
      yield put(getTrashPointDetailsSuccessAction(response.data));
    } else {
      yield put(setErrorMessage('No response data '));
    }
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}


export function* getTrashPointDetailsFlow() {
  while (true) {
    yield take(GET_TRASH_POINT_ORIGIN_ACTION);
    yield put(controlProgress(true));
    yield call(getTrashPointDetails);
    yield put(controlProgress(false));
  }
}

function* deleteTrashPoint(
  id,
) {
  try {
    const response = yield call(
      Api.trashPoints.deleteTrashPointRequest,
      id,
    );

    if (response.data) {
      yield put(deleteTrashPointSuccessAction(id));
    } else {
      yield put(setErrorMessage('No response data '));
    }
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}


export function* deleteTrashPointFlow() {
  while (true) {
    const { payload } = yield take(DELETE_TRASH_POINT_ACTION);

    const {
      id,
    } = payload;
    yield put(controlProgress(true));
    yield call(
      deleteTrashPoint,
      id,
    );
    yield put(controlProgress(false));
  }
}

function* getTrashPointImages(
  id,
) {
  try {
    const response = yield call(
      Api.trashPoints.getTrashPointImagesRequest,
      id,
    );

    if (response.data) {
      yield put(getTrashPointImagesSuccessAction(response.data.trashPointImages));
    } else {
      yield put(setErrorMessage('No response data '));
    }
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}


export function* getTrashPointImagesFlow() {
  while (true) {
    const { payload } = yield take(GET_TRASH_POINT_IMAGES_ACTION);

    const {
      id,
    } = payload;
    yield put(controlProgress(true));
    yield call(
      getTrashPointImages,
      id,
    );
    yield put(controlProgress(false));
  }
}

// /// map
export function* getMapTrashPointsFlow() {
  while (true) {
    const { payload } = yield take(REQUEST_TRASH_POINTS_MAP_ACTION);
    try {
      const newDelta = yield call(
        Api.events.calculateDelta,
        payload.viewPortLeftTopCoordinate,
        payload.viewPortRightBottomCoordinate,
        payload.delta,
      );
      yield put(showNewTrashPointsDeltaAction(newDelta));
      const response = yield call(
        Api.trashPoints.fetchAllTrashPointsMarkers,
        payload.viewPortLeftTopCoordinate,
        payload.viewPortRightBottomCoordinate,
        payload.delta,
        payload.datasetId,
      );
      if (isEmpty(response)) {
        yield put(isTrashPointEmpty(true));
      } else {
        yield put(isTrashPointEmpty(false));
      }
      yield put(loadTrashPointsForMapSuccess(response));
    } catch (error) {
      yield put(setErrorMessage(error.message));
    }
  }
}

export function* fetchTrashPointsDataFromOneClusterFlow() {
  while (true) {
    const { payload } = yield take(LOAD_TRASH_POINT_FROM_CLUSTER_ACTION);
    try {
      const response = yield call(
        Api.trashPoints.fetchClustersList,
        payload,
      );
      yield put(loadTrashPointsForMapSuccess(response));
    } catch (error) {
      yield put(setErrorMessage(error.message));
    }
  }
}

export function* fetchTrashpointFlow() {
  while (true) {
    try {
      const { payload } = yield take(GET_TRASH_POINT_DETAILS_ACTION);
      const {
        trashpointId,
        userId,
      } = payload;
      yield put(controlProgress(true));
      const response = yield call(Api.trashPoints.fetchTrashpointById,
        trashpointId,
        userId);
      yield put(getTrashPointSuccess(response));
      yield put(controlProgress(false));
    } catch (error) {
      yield put(controlProgress(false));
      yield put(setErrorMessage(error.message));
    }
  }
}

