import { call, put, take } from 'redux-saga/effects';

import {
    setErrorMessage,
} from '../actions/app';

import {
    CREATE_EVENT_ACTION,
    createEventDone,
    createEventError,
} from '../actions/createEvent';

import Api from '../../api';

function* createNewEvent(event) {
    try {
        const eventFromServer = yield call(Api.createEvent.createEvent, event);
        yield put(createEventDone(eventFromServer))
    } catch (error) {
        console.warn('createNewEvent', error);
        yield put(createEventError(error))
    }
}

export function* createEventFlow() {
    //console.warn("createEventFlow befor");
    while(true){
        //console.warn("createEventFlow after");
        const {event} = yield take(CREATE_EVENT_ACTION);
        yield call(createNewEvent, event)
    }
}