import { call, put, take } from 'redux-saga/effects';

import { controlProgress } from '../actions/app';

import { setErrorMessage } from '../actions/error';

import {
  CREATE_EVENT_ACTION,
  createEventDone,
} from '../actions/createEvent';

import { loadMyEventsSuccess } from '../actions/profile';

import Api from '../../api';


function* createNewEvent(event) {
  try {
    const eventFromServer = yield call(Api.createEvent.createEvent, event);

    const listMyEvents = yield call(Api.profile.loadMyEvents, 15, 1);

    const events = {
      listMyEvents,
      pageSize: 15,
      pageNumber: 1,
    };
    yield put(createEventDone(eventFromServer));
    yield put(loadMyEventsSuccess(events));
  } catch (error) {
    yield put(controlProgress(false));
    yield put(setErrorMessage(error.message));
  }
}

export function* createEventFlow() {
  while (true) {
    const { payload } = yield take(CREATE_EVENT_ACTION);
    yield put(controlProgress(true));
    yield call(createNewEvent, payload);
    yield put(controlProgress(false));
  }
}
