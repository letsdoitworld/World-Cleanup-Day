import TYPES from './types';

const TEAMS_INITIAL_STATE = {
  teams: [],
  loading: false,
  teamLoading: false,
  error: false,
  team: {},
};
const teamsReducer = (state = TEAMS_INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPES.FETCH_TEAMS_REQUEST:
      return { ...state, loading: true };
    case TYPES.FETCH_TEAMS_SUCCESS:
      return { ...state, loading: false, teams: action.teams };
    case TYPES.FETCH_TEAMS_FAILED:
      return { ...state, loading: false };
    case TYPES.FETCH_TEAM_REQUEST:
      return { ...state, teamLoading: true };
    case TYPES.FETCH_TEAM_SUCCESS:
      return { ...state, teamLoading: false, team: action.team };
    case TYPES.FETCH_TEAM_FAILED:
      return { ...state, teamLoading: false };
    default:
      return state;
  }
};

export default teamsReducer;
