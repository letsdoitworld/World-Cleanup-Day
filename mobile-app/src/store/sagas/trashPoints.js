import {call, put, take} from "redux-saga/effects";
import {SEARCH_TRASH_POINTS_ACTION} from '../types/trashPoints';
import {
    controlProgress,
    setErrorMessage
} from "../actions/app";
import {
    searchTrashPointsAction,
    searchTrashPointsErrorAction,
    searchTrashPointsSuccessAction
} from "../actions/trashPoints";
import Api from '../../api';

function* searchTrashPoints(query, page, pageSize, location) {
    try {
        const response = yield call(Api.trashPoints.searchTrashPointsRequest, query, page, pageSize, location);
        if (response.data) {
            yield put(searchTrashPointsSuccessAction(response.data.records, page, pageSize));
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
        yield put(controlProgress(true));
        yield call(searchTrashPoints, query, page, pageSize, location);
        yield put(controlProgress(false));
    }
}