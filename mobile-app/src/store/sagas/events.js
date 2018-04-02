import { call, put, take } from 'redux-saga/effects';
import {
    LOAD_EVENT,
} from '../types/events';

import {SEARCH_EVENTS_ACTION, LOAD_EVENTS_FOR_MAP_ACTION} from '../actions/events';
import {
    controlProgress,
    setErrorMessage,
    fetchDatasetUIIDAction,
} from '../actions/app';
import {
    searchEventsAction,
    searchEventsErrorAction,
    searchEventsSuccessAction,
    loadEventSuccess,
    loadEventError,
    loadEventsForMapSuccess,
    loadEventsForMapError,
    showNewDeltaAction,
} from '../actions/events';

import Api from '../../api';
import {datasetUUID} from "../selectors";

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
            const response = yield call(Api.events.fetchAllEventMarkers, payload.viewPortLeftTopCoordinate,
                payload.viewPortRightBottomCoordinate, payload.delta, payload.datasetId);
            //yield put(showNewDeltaAction(newDelta));
            yield put(loadEventsForMapSuccess(response))
        } catch (error) {
            console.log("getMapEventsFlow error", error);
            yield put(loadEventsForMapError(error));
        }


    }
}