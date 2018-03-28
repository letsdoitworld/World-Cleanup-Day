import { call, put, take } from 'redux-saga/effects';
import {
    SEARCH_EVENTS_ACTION,
    LOAD_EVENT,
} from '../types/events';

import {
    controlProgress,
    setErrorMessage,
} from '../actions/app';
import {
    searchEventsAction,
    searchEventsErrorAction,
    searchEventsSuccessAction,
    loadEventSuccess,
    loadEventError,
} from '../actions/events';

import Api from '../../api';

function* searchEvents(query, page, pageSize, location) {
  try {
      const response = yield call(Api.events.searchEventsRequest, query, page, pageSize, location);
      if (response.status) {
          yield put(searchEventsSuccessAction(response.events, page, pageSize));
        } else {
          setErrorMessage(String(response.error));
        }
    } catch (error) {
      console.log(error);
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
        console.log('Responce', response);
        yield put(loadEventSuccess(response));

      } catch (error) {
        yield put(loadEventError(error.response.data));
        setErrorMessage(String(error));
      }
  }
  
  export function* loadEventFlow() {
    while (true) {
        console.log('in')
        const { payload } = yield take(LOAD_EVENT);
        console.log('Id', payload);
        yield call(loadEvent, payload);
      }
  }
