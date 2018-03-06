import { call, put, take } from 'redux-saga/effects';

import {
  setErrorMessage,
} from '../actions/app';

import {
  // CREATE_PROFILE_ACTION,
  FETCH_PROFILE,
  UPDATE_PROFILE_STATUS_ACTION,
  fetchProfileDone,
} from '../actions/profile';

import {
  getProfile,
  updateProfileStatus,
} from '../../api';

function* loadProfile() {
  console.log('In loadProfile');
  try {
    const response = yield call(getProfile);
    console.log('NewloadProfile - response', response);
    yield put(fetchProfileDone(response));
  } catch (error) {
    console.log(error);
    setErrorMessage(String(error));
  }
}

function* updateStatus(profileStatus) {
  try {
    const status = yield call(updateProfileStatus, profileStatus);
  } catch (error) {
    console.warn(error);
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
    const { profileStatus } = yield take(UPDATE_PROFILE_STATUS_ACTION);
    yield call(updateStatus, profileStatus);
  }
}
