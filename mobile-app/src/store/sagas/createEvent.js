import {call, put, take} from 'redux-saga/effects';

import {controlProgress,} from '../actions/app';

import {CREATE_EVENT_ACTION, createEventDone, createEventError,} from '../actions/createEvent';

import {loadMyEventsSuccess,} from '../actions/profile';

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
    yield put(createEventError(error.message));
  }
}

export function* createEventFlow() {
  while (true) {
    const { localEvent } = yield take(CREATE_EVENT_ACTION);
    yield put(controlProgress(true));
    yield call(createNewEvent, localEvent);
    yield put(controlProgress(false));
  }
}
