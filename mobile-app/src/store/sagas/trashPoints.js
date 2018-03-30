import {call, put, take} from "redux-saga/effects";
import {CREATE_TRASH_POINT_ACTION, SEARCH_TRASH_POINTS_ACTION} from '../types/trashPoints';
import {
    controlProgress,
    setErrorMessage
} from "../actions/app";
import {
    createTrashPointErrorAction,
    createTrashPointSuccessAction,
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

////////

function* createTrashPoint(
    hashtags,
    composition,
    location,
    status,
    address,
    amount,
    name,
    photos,
) {
    try {
        const response = yield call(
            Api.trashPoints.createTrashPointRequest,
            hashtags,
            composition,
            location,
            status,
            address,
            amount,
            name,
            photos
        );

        if (response.data) {
            yield put(createTrashPointSuccessAction(response.data.trashpoint));
        } else {
            yield put(createTrashPointErrorAction(error));
            setErrorMessage(String(response.error));
        }

    } catch (error) {
        console.log(error);
        setErrorMessage(String(error));
    }
}


export function* createTrashPointFlow() {
    while (true) {
        const {
            hashtags,
            composition,
            location,
            status,
            address,
            amount,
            name,
            photos,
        } = yield take(CREATE_TRASH_POINT_ACTION);
        yield put(controlProgress(true));
        yield call(
            createTrashPoint,
            hashtags,
            composition,
            location,
            status,
            address,
            amount,
            name,
            photos,
        );
        yield put(controlProgress(false));
    }
}

