import actions from './actions';
import Api from '../../services/Api';
import types from './types';
import { DATASETS_TYPES, API_ENDPOINTS } from '../../shared/constants';

const setPopoverShown = () => async dispatch => {
  dispatch(actions.setPopoverShown());
};
const setPopoverMessage = message => async dispatch => {
  dispatch(actions.setPopoverMessage(message));
};

const fetchDatasets = () => {
  return async dispatch => {
    dispatch({ type: types.FETCH_DATASETS_REQUEST });
    const response = await Api.get(API_ENDPOINTS.FETCH_DATASETS, {
      withToken: false,
    });

    if (!response) {
      return dispatch({ type: types.FETCH_DATASETS_FAILED });
    }

    const { data } = response;
    dispatch({
      type: types.FETCH_DATASETS_SUCCESS,
      trashpointsDatasetUUID: data.find(
        ({ type }) => type === DATASETS_TYPES.TRASHPOINTS,
      ).id,
    });
  };
};

export default {
  setPopoverShown,
  setPopoverMessage,
  fetchDatasets,
  ...actions,
};
