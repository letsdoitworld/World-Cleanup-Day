import { call, put, take } from 'redux-saga/effects';
import isEmpty from 'lodash/isEmpty';
import { LOAD_EVENT } from '../types/events';

import {
  LOAD_EVENTS_FOR_MAP_ACTION,
  LOAD_EVENTS_FROM_CLUSTER_ACTION,
  DELETE_EVENT_ACTION,
  loadEventsForMapSuccess,
  loadEventSuccess,
  SEARCH_EVENTS_ACTION,
  searchEventsSuccessAction,
  showNewDeltaAction,
  isEventsEmpty,
  JOIN_EVENT,
  deleteEventSuccess,
} from '../actions/events';
import { controlProgress } from '../actions/app';
import { setErrorMessage } from '../actions/error';
import { loadMyEvents } from './profile';
import Api from '../../api';

function* searchEvents(query, page, pageSize, location, viewPort) {
  try {
    const response = yield call(
      Api.events.searchEventsRequest,
      query,
      page,
      pageSize,
      location,
      viewPort);
    if (response.data) {
      yield put(searchEventsSuccessAction(response.data.records, page, pageSize));
    } else {
      yield put(setErrorMessage('No response data '));
    }
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}

function* joinEvents(id) {
  try {
    yield call(Api.events.joinEvent, id);
    const response = yield call(Api.events.loadEvent, id);
    yield put(loadEventSuccess(response));
    yield call(loadMyEvents, 15, 1);
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}

export function* joinEventFlow() {
  while (true) {
    const { payload } = yield take(JOIN_EVENT);
    yield call(joinEvents, payload);
  }
}

function* deleteEvent(id) {
  try {
    yield call(Api.events.deleteEvent, id);
    yield call(loadMyEvents, 15, 1);
    yield put(deleteEventSuccess());
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}

export function* deleteEventFlow() {
  while (true) {
    const { payload } = yield take(DELETE_EVENT_ACTION);
    yield call(deleteEvent, payload);
  }
}

export function* searchEventsFlow() {
  while (true) {
    const { payload } = yield take(SEARCH_EVENTS_ACTION);
    yield put(controlProgress(true));
    yield call(
      searchEvents,
      payload.query,
      payload.page,
      payload.pageSize,
      payload.location,
      payload.viewPort);
    yield put(controlProgress(false));
  }
}


function* loadEvent(id) {
  try {
    const response = yield call(Api.events.loadEvent, id);

    yield put(loadEventSuccess(response));
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}

export function* loadEventFlow() {
  while (true) {
    const { payload } = yield take(LOAD_EVENT);
    yield call(loadEvent, payload);
  }
}


export function* getMapEventsFlow() {
  while (true) {
    const { payload } = yield take(LOAD_EVENTS_FOR_MAP_ACTION);
    try {
      const newDelta = yield call(
        Api.events.calculateDelta,
        payload.viewPortLeftTopCoordinate,
        payload.viewPortRightBottomCoordinate,
        payload.delta);
      yield put(showNewDeltaAction(newDelta));
      const response = yield call(
        Api.events.fetchAllEventMarkers,
        payload.viewPortLeftTopCoordinate,
        payload.viewPortRightBottomCoordinate,
        payload.delta,
        payload.datasetId);
      if (isEmpty(response)) {
        yield put(isEventsEmpty(true));
      } else {
        yield put(isEventsEmpty(false));
      }
      yield put(loadEventsForMapSuccess(response));
    } catch (error) {
      yield put(setErrorMessage(error.message));
    }
  }
}

export function* fetchDataFromOneClusterFlow() {
  while (true) {
    const { payload } = yield take(LOAD_EVENTS_FROM_CLUSTER_ACTION);
    try {
      const response = yield call(Api.events.fetchClustersList, payload);
      yield put(loadEventsForMapSuccess(response));
    } catch (error) {
      yield put(setErrorMessage(error.message));
    }
  }
}
