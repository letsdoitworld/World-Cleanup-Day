import {call, put, take} from "redux-saga/effects";
import {SEARCH_EVENTS_ACTION} from '../types/events';
import {
    controlProgress,
    setErrorMessage
} from "../actions/app";
import {
    searchEventsAction,
    searchEventsErrorAction,
    searchEventsSuccessAction
} from "../actions/events";

import Api from '../../api';

function* searchEvents(query, page, pageSize, location) {
    console.log("2");
    try {
        const response = yield call(Api.events.searchEventsRequest, query, page, pageSize, location);
        console.log("3");
        if (response.status) {
            yield put(searchEventsSuccessAction(response.events, page, pageSize));
            console.log("4 " + response.events.length);
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
        const {query, page, pageSize, location} = yield take(SEARCH_EVENTS_ACTION);
        console.log("1");
        yield put(controlProgress(true));
        yield call(searchEvents, query, page, pageSize, location);
        yield put(controlProgress(false));
        console.log("5");
    }
}