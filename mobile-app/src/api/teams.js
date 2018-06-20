import Api from '../services/Api';
import { API_ENDPOINTS } from '../shared/constants';

async function getTeams(search) {
  try {
    const url = API_ENDPOINTS.FETCH_TEAMS(search);
    const response = await Api.get(url);
    return response.data;
  } catch (ex) {
    throw ex;
  }
}

async function getTeam(teamId) {
  try {
    const url = API_ENDPOINTS.FETCH_TEAM(teamId);
    const response = await Api.get(url);
    return response.data;
  } catch (ex) {
    throw ex;
  }
}

export default {
  getTeams,
  getTeam
};