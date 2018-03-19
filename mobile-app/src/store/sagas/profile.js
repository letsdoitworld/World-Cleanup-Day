import { call, put, take } from 'redux-saga/effects';

import {
  setErrorMessage,
} from '../actions/app';

import {
  // CREATE_PROFILE_ACTION,
  FETCH_PROFILE,
  UPDATE_PROFILE_STATUS_ACTION,
  fetchProfileDone,
  updateProfileStatusDone,
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
    const statusData = { value: profileStatus };
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
    const { payload } = yield take(UPDATE_PROFILE_STATUS_ACTION);
    yield call(updateStatus, payload);
  }
}
