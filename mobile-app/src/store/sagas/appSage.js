import { call, put, take } from 'redux-saga/effects';
import {
  FETCH_DATASETS_REQUEST,
  fetchDatasetUIIDSuccsess,
} from '../actions/app';
import { setErrorMessage } from '../actions/error';
import Api from '../../api';
import { DATASETS_TYPES } from '../../shared/constants';

export function* fetchDatasetFlow() {
  while (true) {
    yield take(FETCH_DATASETS_REQUEST);
    try {
      const response = yield call(Api.appApi.fetchDatasets);
      if (!response) {
        yield put(setErrorMessage('Fetch dataset failed!'));
      }
      yield put(fetchDatasetUIIDSuccsess(response.find(
        ({ type }) => type === DATASETS_TYPES.TRASHPOINTS,
      ).id));
    } catch (ex) {
      yield put(setErrorMessage(ex.message));
    }
  }
}
