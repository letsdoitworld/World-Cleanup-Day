import { call, put, take } from 'redux-saga/effects';

import {
    setErrorMessage,
} from '../actions/app';

import {
    CREATE_EVENT_ACTION,
    createEventDone,
} from '../actions/createEvent';

import Api from '../../api';

function* createNewEvent(event) {
    try {
        const eventFromServer = yield call(Api.createEvent.createEvent, event);
        //console.warn("CreateEvent", eventFromServer);
        yield put(createEventDone(eventFromServer))
    } catch (error) {
        setErrorMessage(String(error))
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