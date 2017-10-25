import Api from '../../services/Api';
import userActions from '../user/actions';
import types from './types';
import { handleSentryError } from '../../shared/helpers';
import { API_ENDPOINTS } from '../../shared/constants';

const updateTeam = profile => async (dispatch) => {
  dispatch(userActions.updateProfile());

  try {
    const response = await Api.put(API_ENDPOINTS.USER_TEAM, profile);
    if (!response || !response.data) {
      throw { error: 'Could not not read response data' };
    }
    dispatch(userActions.updateProfileDone(response.data));
    return response.data;
  } catch (ex) {
    handleSentryError(ex);
    dispatch(userActions.updateProfileError(ex));
  }
};

const fetchTeams = () => {
  return async dispatch => {
    const response = await Api.get(API_ENDPOINTS.FETCH_TEAMS);
    if (!response) {
      return dispatch({ type: types.FETCH_TEAMS_FAILED });
    }

    const { data } = response;
    dispatch({
      type: types.FETCH_TEAMS_SUCCESS,
      payload: data,
    });
  };
};


export default {
  updateTeam,
  fetchTeams,
};
