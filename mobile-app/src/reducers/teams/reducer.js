import types from './types';

const initialState = {
  list: [],
  loading: false,
  team: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_TEAMS_REQUEST:
      return { ...state, loading: true };
    case types.FETCH_TEAMS_SUCCESS:
      return { ...state, list: action.payload, loading: false };
    case types.FETCH_TEAMS_FAILED:
      return { ...state, loading: false };
    case types.CLEAR_TEAMS_SUCCESS:
      return { ...state, list: [] };
    case types.FETCH_TEAMS_BY_COUNTRY_REQUEST:
      return { ...state, loading: true };
    case types.FETCH_TEAMS_BY_COUNTRY_SUCCESS:
      return { ...state, list: action.payload, loading: false};
    case types.FETCH_TEAMS_BY_COUNTRY_FAILED:
      return { ...state, loading: false };
    case types.FETCH_TEAM_REQUEST:
      return { ...state, loading: true };
    case types.FETCH_TEAM_SUCCESS:
      return { ...state, team: action.payload, loading: false};
    case types.FETCH_TEAM_FAILED:
      return { ...state, loading: false };
    default:
      return state;
  }
};

