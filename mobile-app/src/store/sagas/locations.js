import { call, put, take } from 'redux-saga/effects';

import {
  setErrorMessage,
} from '../actions/app';

import {
  FETCH_USER_LOCATION,
  fetchUserLocationDone,
  fetchUserLocationError,
} from '../actions/locations';

import Api from '../../api';

function* loadLocation() {
  try {
    const { payload } = yield take(FETCH_USER_LOCATION);

    const response = yield call(Api.locations.fetchAddress, payload);

    yield put(fetchUserLocationDone(response));
  } catch (error) {
    yield put(fetchUserLocationError(error));
    setErrorMessage(String(error));
  }
}

export function* loadLocationFlow() {
  while (true) {
    // yield take(FETCH_LOCATION);
    // yield* takeEvery(FETCH_LOCATION, loadLocation);
    yield call(loadLocation);
  }
}

