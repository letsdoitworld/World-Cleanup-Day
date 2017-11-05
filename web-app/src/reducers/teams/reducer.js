import TYPES from './types';

const TEAMS_INITIAL_STATE = {
    teams: [],
    loading: false,
    error: false,
};
const teamsReducer = (state = TEAMS_INITIAL_STATE, action) => {
    switch (action.type) {
        case TYPES.FETCH_TEAMS_REQUEST:
            return { ...state, loading: true };
        case TYPES.FETCH_TEAMS_SUCCESS:
            return { ...state, loading: false, teams: action.teams };
        case TYPES.FETCH_TEAMS_FAILED:
            return { ...state, loading: false };
        default:
            return state;
    }
};

export default teamsReducer;