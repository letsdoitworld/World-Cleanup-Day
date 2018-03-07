import {call, put, take} from "redux-saga/effects";
import {SEARCH_TRASH_POINTS_ACTION} from './types';
import {
    controlProgress,
    setErrorMessage
} from "../app/actions";
import {
    searchTrashPointsAction,
    searchTrashPointsErrorAction,
    searchTrashPointsSuccessAction
} from "../trashpoints/actions";
import {
    searchTrashPointsRequest
} from "./operations";

function* searchTrashPoints(query, page, pageSize, location) {
    console.log("2");
    try {
        const response = yield call(searchTrashPointsRequest, query, page, pageSize, location);
        console.log("3");
        if (response.status) {
            yield put(searchTrashPointsSuccessAction(response.trashPoints, page, pageSize));
            console.log("4 " + response.trashPoints.length);
        } else {
            setErrorMessage(String(response.error));
        }
    } catch (error) {
        console.log(error);
        setErrorMessage(String(error));
    }
}

export function* searchTrashPointsFlow() {
    while (true) {
        const {query, page, pageSize, location} = yield take(SEARCH_TRASH_POINTS_ACTION);
        console.log("1");
        yield put(controlProgress(true));
        yield call(searchTrashPoints, query, page, pageSize, location);
        yield put(controlProgress(false));
        console.log("5");
    }
}