import {call, put, take} from "redux-saga/effects";
import {SEARCH_TRASH_POINTS_ACTION} from './types';
import appActions from "../app/actions";
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
            yield put(searchTrashPointsSuccessAction(response.trashPoints));
            console.log("4 " + response.trashPoints.length);
        } else {
            appActions.setErrorMessage(String(response.error));
        }
    } catch (error) {
        console.log(error);
        appActions.setErrorMessage(String(error));
    }
}

export function* searchTrashPointsFlow() {
    while (true) {

        const {query, page, pageSize, location} = yield take(SEARCH_TRASH_POINTS_ACTION);
        console.log("1");
        yield call(searchTrashPoints, query, page, pageSize, location);

        console.log("5");

        // const {name, secondName, role} = yield take(types.CREATE_PROFILE_ACTION);
        // yield put(rootActions.controlProgress(true));
        // yield call(createProfile, name, secondName, role);
        // yield put(rootActions.controlProgress(false));
    }
}