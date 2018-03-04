import types from './types';

const initialState = [];

export default (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_TEAMS_REQUEST:
            return state;
        case types.FETCH_TEAMS_SUCCESS:
            return action.payload;
        case types.FETCH_TEAMS_FAILED:
            return state;
        default:
            return state;
    }
};

