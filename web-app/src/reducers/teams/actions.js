import { API_ENDPOINTS } from '../../shared/constants';
import { ApiService } from '../../services';

import TYPES from './types';

const fetchAllTeams = () => async (dispatch) => {
  dispatch({ type: TYPES.FETCH_TEAMS_REQUEST });

  const response = await ApiService.get(API_ENDPOINTS.FETCH_TEAMS_TRASHPOINTS);
  if (!response) {
    return dispatch({ type: TYPES.FETCH_TEAMS_FAILED });
  }

  dispatch({
    type: TYPES.FETCH_TEAMS_SUCCESS,
    teams: response.data,
  });
};

export default {
  fetchAllTeams,
};
