import {call, put, take} from 'redux-saga/effects';

import {
    setErrorMessage,
} from '../actions/app';

import {
    // CREATE_PROFILE_ACTION,
    FETCH_PROFILE,
    UPDATE_PROFILE_STATUS_ACTION,
    LOAD_MY_EVENTS_ACTION,
    LOAD_MY_TRASH_POINTS_ACTION,
    fetchProfileDone,
    updateProfileStatusDone,
    loadMyEventsSuccess,
    loadMyEventsError,
    loadMyTrashPointsSuccess,
    loadMyTrashPointsError,
} from '../actions/profile';

import Api from '../../api';

function* loadProfile() {
    try {
        const response = yield call(Api.profile.getProfile);
        yield put(fetchProfileDone(response));
    } catch (error) {
        setErrorMessage(String(error));
    }
}

function* updateStatus(profileStatus) {
    try {
        const statusData = {value: profileStatus};
        const status = yield call(Api.profile.updateProfileStatus, statusData);
        if (status.success) {
            yield put(updateProfileStatusDone(profileStatus));
        }
    } catch (error) {
        setErrorMessage(error);
    }
}

export function* loadProfileFlow() {
    while (true) {
        yield take(FETCH_PROFILE);
        yield call(loadProfile);
    }
}

export function* updateProfileStatusFlow() {
    while (true) {
        const {payload} = yield take(UPDATE_PROFILE_STATUS_ACTION);
        yield call(updateStatus, payload);
    }
}

export function* loadMyEvents(pageSize, pageNumber) {
    try {
        const listMyEvents = yield call(Api.profile.loadMyEvents, pageSize, pageNumber);
        //console.warn("loadMyEvents", listMyEvents);
        yield put(loadMyEventsSuccess(listMyEvents, pageSize, pageNumber));
    } catch (error) {
        //console.warn("loadMyEvents error", error.message);
        yield put(loadMyEventsError(error.message));
    }
}

export function* loadMyEventsFlow() {
    while (true) {
        const { pageSize, pageNumber } = yield take(LOAD_MY_EVENTS_ACTION);
        yield call(loadMyEvents, pageSize, pageNumber);
    }
}

export function* loadMyTrashPoints(pageSize, pageNumber) {
    try {
        const listMyTrashPoints = yield call(Api.profile.loadMyTrashPoints, pageSize, pageNumber);
        if (listMyTrashPoints.success) {
            yield put(loadMyTrashPointsSuccess(listMyTrashPoints, pageSize, pageNumber));
        } else {
            yield put(loadMyTrashPointsError(listMyTrashPoints.error));
        }
    } catch (error) {
        yield put(loadMyTrashPointsError(error.message));
    }
}

export function* loadMyTrashPointsFlow() {
    while (true) {
        const { pageSize, pageNumber } = yield take(LOAD_MY_TRASH_POINTS_ACTION);
        yield call(loadMyTrashPoints, pageSize, pageNumber);
    }
}
