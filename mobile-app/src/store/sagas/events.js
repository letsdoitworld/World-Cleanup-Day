import {call, put, take} from 'redux-saga/effects';
import {LOAD_EVENT,} from '../types/events';

import {
    LOAD_EVENTS_FOR_MAP_ACTION,
    LOAD_EVENTS_FROM_CLUSTER_ACTION,
    loadEventError,
    loadEventsForMapError,
    loadEventsForMapSuccess,
    loadEventSuccess,
    SEARCH_EVENTS_ACTION,
    searchEventsSuccessAction,
    SET_NEW_DELAY,
    showNewDeltaAction
} from '../actions/events';
import {controlProgress, setErrorMessage,} from '../actions/app';

import Api from '../../api';

function* searchEvents(query, page, pageSize, location) {
    try {
        const response = yield call(Api.events.searchEventsRequest, query, page, pageSize, location);
        if (response.data) {
            yield put(searchEventsSuccessAction(response.data.records, page, pageSize));
        } else {
          setErrorMessage(String(response.error));
        }
    } catch (error) {
      setErrorMessage(String(error));
    }
}

export function* searchEventsFlow() {
  while (true) {
      const { query, page, pageSize, location } = yield take(SEARCH_EVENTS_ACTION);

      yield put(controlProgress(true));
      yield call(searchEvents, query, page, pageSize, location);
      yield put(controlProgress(false));
    }
}


function* loadEvent(id) {
    try {
        const response = yield call(Api.events.loadEvent, id);

        yield put(loadEventSuccess(response));

      } catch (error) {
        yield put(loadEventError(error.response.data));
        setErrorMessage(String(error));
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
            const newDelta = yield call(Api.events.calculateDelta, payload.viewPortLeftTopCoordinate,
                payload.viewPortRightBottomCoordinate, payload.delta);
            yield put(showNewDeltaAction(newDelta));
            const response = yield call(Api.events.fetchAllEventMarkers, payload.viewPortLeftTopCoordinate,
                payload.viewPortRightBottomCoordinate, payload.delta, payload.datasetId);
            yield put(loadEventsForMapSuccess(response))
        } catch (error) {
            yield put(loadEventsForMapError(error));
        }


    }
}

export function* fetchDataFromOneClusterFlow() {
    while (true) {
        const { payload } = yield take(LOAD_EVENTS_FROM_CLUSTER_ACTION);
        try {
            const response = yield call(Api.events.fetchClustersList, payload.cellSize,
                payload.coordinates, payload.clusterId, payload.datasetId, payload.markers);
            yield put(loadEventsForMapSuccess(response))
        } catch (error) {
            yield put(loadEventsForMapError(error));
        }


    }
}