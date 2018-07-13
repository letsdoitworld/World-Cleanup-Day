import { call, put, take } from 'redux-saga/effects';
import find from 'lodash/find';
import { setErrorMessage } from '../actions/error';

import {
  FETCH_PROFILE,
  fetchProfileDone,
  LOAD_MY_EVENTS_ACTION,
  LOAD_MY_TRASH_POINTS_ACTION,
  loadMyEventsPaginationSuccess,
  loadMyEventsSuccess,
  loadMyTrashPointsPaginationSuccess,
  loadMyTrashPointsSuccess,
  UPDATE_PROFILE_STATUS_ACTION,
  updateProfileStatusDone,
  UPDATE_PROFILE_COUNTRY,
  UPDATE_PROFILE_TEAM,
  updateProfileTeamDone,
} from '../actions/profile';

import Api from '../../api';
import { COUNTRY_LIST } from '../../shared/constants';

function* loadProfile() {
  try {
    const response = yield call(Api.profile.getProfile);
    const countryData = find(COUNTRY_LIST, c => c.code === response.country);
    if (countryData) {
      response.country = countryData.name;
    }
    yield put(fetchProfileDone(response));
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}

function* updateStatus(profileStatus) {
  try {
    const statusData = { value: profileStatus };
    const status = yield call(Api.profile.updateProfileStatus, statusData);
    if (status.success) {
      yield put(updateProfileStatusDone(profileStatus));
    }
  } catch (error) {
    yield put(setErrorMessage(error.message));
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
    const { payload } = yield take(UPDATE_PROFILE_STATUS_ACTION);
    yield call(updateStatus, payload);
  }
}

export function* loadMyEvents(pageSize, pageNumber) {
  try {
    const listMyEvents = yield call(Api.profile.loadMyEvents, pageSize, pageNumber);
    const events = {
      listMyEvents,
      pageSize,
      pageNumber,
    };

    if (events.pageNumber > 1) {
      yield put(loadMyEventsPaginationSuccess(events));
    } else {
      yield put(loadMyEventsSuccess(events));
    }
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}

export function* loadMyEventsFlow() {
  while (true) {
    const { payload } = yield take(LOAD_MY_EVENTS_ACTION);
    const { pageSize, pageNumber } = payload;
    yield call(loadMyEvents, pageSize, pageNumber);
  }
}

export function* loadMyTrashPoints(pageSize, pageNumber) {
  try {
    const responce = yield call(Api.profile.loadMyTrashPoints, pageSize, pageNumber);
    const trashpoints = {
      listMyTrashPoints: responce.records,
      pageSize: responce.pageSize,
      pageNumber: responce.pageNumber,
    };

    if (responce.pageNumber > 1) {
      yield put(loadMyTrashPointsPaginationSuccess(trashpoints));
    } else {
      yield put(loadMyTrashPointsSuccess(trashpoints));
    }
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}

export function* loadMyTrashPointsFlow() {
  while (true) {
    const { payload } = yield take(LOAD_MY_TRASH_POINTS_ACTION);
    const { pageSize, pageNumber } = payload;
    yield call(loadMyTrashPoints, pageSize, pageNumber);
  }
}

export function* updateProfileFlow() {
  while (true) {
    try {
      const { payload } = yield take(UPDATE_PROFILE_COUNTRY);
      const response = yield call(Api.profile.updateProfile, payload);
      yield put(fetchProfileDone(response));
    } catch (error) {
      yield put(setErrorMessage(error.message));
    }
  }
}

export function* updateProfileTeam(teamId) {
  try {
    const response = yield call(Api.profile.updateProfileTeam, teamId);
    yield put(updateProfileTeamDone(response));
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}

export function* updateProfileTeamFlow() {
  while (true) {
    const { payload } = yield take(UPDATE_PROFILE_TEAM);
    yield call(updateProfileTeam, payload);
  }
}

