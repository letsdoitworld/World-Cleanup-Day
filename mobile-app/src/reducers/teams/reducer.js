import types from './types';

const initialState = {
  list: [],
  loading: false,
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
    default:
      return state;
  }
};

