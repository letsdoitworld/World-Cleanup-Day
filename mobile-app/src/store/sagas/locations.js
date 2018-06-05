import { call, put, take } from 'redux-saga/effects';

import {
  setErrorMessage,
} from '../actions/error';

import {
  FETCH_USER_LOCATION,
  fetchUserLocationDone,
} from '../actions/locations';

import Api from '../../api';

function* loadLocation(payload) {
  try {
    const response = yield call(Api.locations.fetchAddress, payload);

    const userLocation = {
      ...response,
      ...payload,
    };

    yield put(fetchUserLocationDone(userLocation));
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}

export function* loadLocationFlow() {
  while (true) {
    const { payload } = yield take(FETCH_USER_LOCATION);
    yield call(loadLocation, payload);
  }
}

