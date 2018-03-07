import { call, put, take } from 'redux-saga/effects';

import {
    setErrorMessage,
} from '../actions/app';

import {
    CREATE_EVENT_ACTION,
    CREATE_EVENT_SUCCESS,
    CREATE_EVENT_ERROR,
    createEventDone,
} from '../actions/create-event-action';

import { createEvent } from '../../api';

function* createNewEvent(event) {
    try {
        const eventFromServer = yield call(createEvent, event);
        yield put(createEventDone, eventFromServer)
    } catch (error) {
        setErrorMessage(String(error))
    }
}

export function* createEventFlow() {
    while(true){
        const {event} = yield take(CREATE_EVENT_ACTION);
        yield call(createNewEvent, event)
    }
}