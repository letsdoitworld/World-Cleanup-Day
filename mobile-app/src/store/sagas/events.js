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
    try {
        const response = yield call(Api.events.searchEventsRequest, query, page, pageSize, location);
        if (response.data) {
            yield put(searchEventsSuccessAction(response.data.records, page, pageSize));
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

        yield put(controlProgress(true));
        yield call(searchEvents, query, page, pageSize, location);
        yield put(controlProgress(false));
    }
}