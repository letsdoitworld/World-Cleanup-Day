import { API_ENDPOINTS, USER_ROLES } from '../../shared/constants';
import { ApiService } from '../../services';
import { selectors as userSelectors } from '../../reducers/user';

import TYPES from './types';

const fetchAllTeams = () => async (dispatch, getState) => {
  dispatch({ type: TYPES.FETCH_TEAMS_REQUEST });
  const country = userSelectors.getProfile(getState()).country;
  const superadmin = userSelectors.getProfile(getState()).role === USER_ROLES.SUPERADMIN;
  const response = country ? await ApiService.get(API_ENDPOINTS.FETCH_TEAMS(country, superadmin)) : await ApiService.get(API_ENDPOINTS.FETCH_ALL_TEAMS(superadmin));
  if (!response) {
    return dispatch({ type: TYPES.FETCH_TEAMS_FAILED });
  }

  dispatch({
    type: TYPES.FETCH_TEAMS_SUCCESS,
    teams: response.data,
  });
};


const fetchTeam = (teamId) => async dispatch => {
  dispatch({ type: TYPES.FETCH_TEAM_REQUEST });
  const response = await ApiService.get(API_ENDPOINTS.FETCH_TEAM(teamId));
  if (!response) {
    return dispatch({ type: TYPES.FETCH_TEAM_FAILED });
  }

  dispatch({
    type: TYPES.FETCH_TEAM_SUCCESS,
    team: response.data,
  });
};

export default {
  fetchAllTeams,
  fetchTeam
};
