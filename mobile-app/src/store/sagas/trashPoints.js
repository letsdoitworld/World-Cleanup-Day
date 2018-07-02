import { call, put, take, select } from 'redux-saga/effects';
import isEmpty from 'lodash/isEmpty';
import {
  CREATE_TRASH_POINT_ACTION, CREATE_TRASH_POINT_OFFLINE,
  LOAD_TRASH_POINT_FROM_CLUSTER_ACTION,
  REQUEST_TRASH_POINTS_MAP_ACTION,
  SEARCH_TRASH_POINTS_ACTION,
} from '../types/trashPoints';
import { controlProgress, updateSyncStatus } from '../actions/app';
import { setErrorMessage } from '../actions/error';
import { datasetUUID } from '../selectors';
// import { isConnected } from '../selectors';
import {
  createTrashPointErrorAction,
  createTrashPointSuccessAction,
  loadTrashPointsForMapSuccess,
  searchTrashPointsSuccessAction,
  showNewTrashPointsDeltaAction,
  isTrashPointEmpty,
  createTrashPointOfflineAction,
} from '../actions/trashPoints';
import Api from '../../api';
import OfflineService from '../../services/Offline';
import { API_ENDPOINTS } from '../../shared/constants';

// import {LOAD_EVENTS_FOR_MAP_ACTION,
// loadEventsForMapSuccess, showNewDeltaAction} from "../actions/events";

function* searchTrashPoints(query, page, pageSize, location) {
  try {
    const response = yield call(
      Api.trashPoints.searchTrashPointsRequest,
      query,
      page,
      pageSize,
      location,
    );
    // console.warn('searchTrashPoints resp', response);
    // if (response.data) {
    yield put(searchTrashPointsSuccessAction(response.data.records, page, pageSize));
    // } else {
    //   // yield put(controlProgress(false));
    //   yield put(setErrorMessage('No response data '));
    // }
  } catch (error) {
    // yield put(controlProgress(false));
    yield put(setErrorMessage(error.message));
  }
}

export function* searchTrashPointsFlow() {
  while (true) {
    const { payload } = yield take(SEARCH_TRASH_POINTS_ACTION);
    const { query, page, pageSize, location } = payload;
    // yield put(controlProgress(true));
    yield call(searchTrashPoints, query, page, pageSize, location);
    // yield put(controlProgress(false));
  }
}

// //////

function* createTrashPoint(
  hashtags,
  composition,
  location,
  status,
  address,
  amount,
  name,
  photos,
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
      team,
    );
    if (response.data) {
      yield put(createTrashPointSuccessAction(response.data.trashpoint));
    } else {
      yield put(setErrorMessage('No response data '));
    }
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}

function* createTrashpointOffline(
  hashtags,
  composition,
  location,
  status,
  address,
  amount,
  name,
  photos,
  team,
) {
  try {
    const datasetId = yield select(datasetUUID);
    const newMarker = {
      datasetId,
      hashtags,
      composition,
      location,
      status,
      name,
      address,
      amount,
      team
    };
    const response = yield call(
      OfflineService.saveTrashpoint,
      API_ENDPOINTS.CREATE_TRASHPOINT,
      newMarker,
      photos,
    );
    if (response.data) {
      yield put(updateSyncStatus(false));
      yield put(createTrashPointSuccessAction(response.data));
    } else {
      yield put(setErrorMessage('No response data '));
    }
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}

export function* createTrashPointOfflineFlow() {
  while (true) {
    const { payload } = yield take(CREATE_TRASH_POINT_OFFLINE);
    const {
      hashtags,
      composition,
      location,
      status,
      address,
      amount,
      name,
      photos,
      team,
    } = payload;
    yield put(controlProgress(true));
    yield call(
      createTrashpointOffline,
      hashtags,
      composition,
      location,
      status,
      address,
      amount,
      name,
      photos,
      team,
    );
    yield put(controlProgress(false));
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
      team,
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
        Api.events.fetchClustersList,
        payload.cellSize,
        payload.coordinates,
        payload.clusterId,
        payload.datasetId,
        payload.markers,
      );
      yield put(loadTrashPointsForMapSuccess(response));
    } catch (error) {
      yield put(setErrorMessage(error.message));
    }
  }
}

