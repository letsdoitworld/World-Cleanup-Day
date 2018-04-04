import {call, put, take} from "redux-saga/effects";
import {
    CREATE_TRASH_POINT_ACTION,
    LOAD_TRASH_POINT_FROM_CLUSTER_ACTION,
    REQUEST_TRASH_POINTS_MAP_ACTION,
    SEARCH_TRASH_POINTS_ACTION
} from '../types/trashPoints';
import {
    controlProgress,
    setErrorMessage
} from "../actions/app";
import {
    createTrashPointErrorAction,
    createTrashPointSuccessAction,
    loadTrashPointsForMapError,
    loadTrashPointsForMapSuccess,
    searchTrashPointsAction,
    searchTrashPointsErrorAction,
    searchTrashPointsSuccessAction,
    showNewTrashPointsDeltaAction
} from "../actions/trashPoints";
import Api from '../../api';
//import {LOAD_EVENTS_FOR_MAP_ACTION, loadEventsForMapSuccess, showNewDeltaAction} from "../actions/events";

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

///// map
export function* getMapTrashPointsFlow() {
    while (true) {
        const { payload } = yield take(REQUEST_TRASH_POINTS_MAP_ACTION);
        try {
            const newDelta = yield call(
                Api.events.calculateDelta,
                payload.viewPortLeftTopCoordinate,
                payload.viewPortRightBottomCoordinate,
                payload.delta
            );
            console.log("Delta getMapTrashPointsFlow", payload.delta);
            yield put(showNewTrashPointsDeltaAction(newDelta));
            const response = yield call(
                Api.trashPoints.fetchAllTrashPointsMarkers,
                payload.viewPortLeftTopCoordinate,
                payload.viewPortRightBottomCoordinate,
                payload.delta,
                payload.datasetId
            );
            yield put(loadTrashPointsForMapSuccess(response))
        } catch (error) {
            console.log("getMapTrashPointsFlow error", error);
            yield put(loadTrashPointsForMapError(error));
        }
    }
}

export function* fetchTrashPointsDataFromOneClusterFlow() {
    while (true) {
        const { payload } = yield take(LOAD_TRASH_POINT_FROM_CLUSTER_ACTION);
        try {
            const response = yield call(
                Api.events.fetchClustersList,
                payload.cellSize,
                payload.coordinates,
                payload.clusterId,
                payload.datasetId,
                payload.markers
            );
            yield put(loadTrashPointsForMapSuccess(response))
        } catch (error) {
            console.log("fetchTrashPointsDataFromOneClusterFlow error", error);
            yield put(loadTrashPointsForMapError(error));
        }
    }
}



