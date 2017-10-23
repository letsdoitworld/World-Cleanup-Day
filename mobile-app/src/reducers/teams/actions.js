import types from './types';

const fetchTeams = () => ({ type: types.FETCH_TEAMS_REQUEST });
const fetchTeamsSuccess = teams => ({
    type: types.FETCH_TEAMS_SUCCESS,
    payload: teams,
});
const fetchTeamsError = error => ({
    type: types.FETCH_TEAMS_FAILED,
    payload: error,
});

export default {
    fetchTeams,
    fetchTeamsSuccess,
    fetchTeamsError,
};
