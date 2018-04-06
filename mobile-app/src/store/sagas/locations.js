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

function* loadLocation(payload) {
  try {
    const response = yield call(Api.locations.fetchAddress, payload);
    
    const userLocation = {
      ...response,
      ...payload,
    };

    yield put(fetchUserLocationDone(userLocation));
  } catch (error) {
    yield put(fetchUserLocationError(error));
    setErrorMessage(String(error));
  }
}

export function* loadLocationFlow() {
  while (true) {
    const { payload } = yield take(FETCH_USER_LOCATION);
    yield call(loadLocation, payload);
  }
}

