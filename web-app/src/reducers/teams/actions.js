import { API_ENDPOINTS, USER_ROLES } from '../../shared/constants';
import { ApiService } from '../../services';
import { selectors as userSelectors } from '../../reducers/user';
import { actions as errorActions } from '../../reducers/error';
import TYPES from './types';
import { getCountryFromStr } from '../../shared/helpers';

const fetchAllTeams = () => async (dispatch, getState) => {
  try {
    dispatch({ type: TYPES.FETCH_TEAMS_REQUEST });
    const areas = userSelectors.getProfile(getState()).areas;
    const areasFiltered = areas.map(a => getCountryFromStr(a)).filter((value, index, self) => self.indexOf(value) === index);
    // converting areas to countries and filtering only unique values
    // e.g. if user is assigned few areas in one country
    const superadmin = userSelectors.getProfile(getState()).role === USER_ROLES.SUPERADMIN;
    let response;
    let teams = [];
    if (areasFiltered.length > 0) {
      response = await Promise.all(areasFiltered.map(area => ApiService.get(API_ENDPOINTS.FETCH_TEAMS(area, superadmin))));
      response.forEach(r => {
        if (r && r.data.length > 0) {
          teams = [...teams, ...r.data];
        }
      });
    } else {
      response = await ApiService.get(API_ENDPOINTS.FETCH_ALL_TEAMS(superadmin));
      teams = response.data;
    }

    if (!response) {
      return dispatch({ type: TYPES.FETCH_TEAMS_FAILED });
    }

    dispatch({
      type: TYPES.FETCH_TEAMS_SUCCESS,
      teams,
    });
  } catch (e) {
    console.log(e);
    dispatch(errorActions.setErrorMessage('Failed to load teams'));
  }
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
  fetchTeam,
};
