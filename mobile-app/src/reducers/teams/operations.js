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

const fetchTeams = search => {
  return async (dispatch, getState) => {

    dispatch({ type: types.FETCH_TEAMS_REQUEST });

    const response = await Api.get(API_ENDPOINTS.FETCH_TEAMS(getState().user.profile.entity.country || 'EN', search))

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

const fetchTeamsByCountry = () => {
  return async (dispatch, getState) => {
    dispatch({ type: types.FETCH_TEAMS_REQUEST });
    const country = getState().user.profile.entity.country || 'EN';
    const response = await Api.get(API_ENDPOINTS.FETCH_TEAMS_BY_COUNTRY(country));

    if (!response) {
      return dispatch({ type: types.FETCH_TEAMS_BY_COUNTRY_FAILED });
    }

    const { data } = response;
    const filteredTeams = data.filter(team => team.CC === undefined || team.CC === country);
    dispatch({
      type: types.FETCH_TEAMS_BY_COUNTRY_SUCCESS,
      payload: filteredTeams,
    });
  }
};

const clearTeams = () => (dispatch => {
  dispatch({ type: types.CLEAR_TEAMS_SUCCESS });
});


export default {
  updateTeam,
  fetchTeams,
  clearTeams,
  fetchTeamsByCountry
};
