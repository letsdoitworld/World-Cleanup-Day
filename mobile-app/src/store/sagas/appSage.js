import { call, put, take, select } from 'redux-saga/effects';
import { FETCH_DATASETS_REQUEST,
    fetchDatasetUIIDError,
    fetchDatasetUIIDSuccsess } from "../actions/app";
import Api from '../../api';
import {DATASETS_TYPES} from "../../shared/constants";

export function* fetchDatasetFlow() {
    while (true) {
        yield take(FETCH_DATASETS_REQUEST);
        try {
            const response = yield call(Api.appApi.fetchDatasets);
            if (!response) {
                fetchDatasetUIIDError("No response!")
            }
            yield put(fetchDatasetUIIDSuccsess(response.find(
                ({ type }) => type === DATASETS_TYPES.TRASHPOINTS,
            ).id,))
        } catch (ex) {
                fetchDatasetUIIDError(ex)
        }

    }
}