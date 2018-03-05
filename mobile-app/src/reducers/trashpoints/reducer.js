import {SEARCH_TRASH_POINTS_SUCCESS_ACTION} from "./types";

export const trashPointsInitialState = {
    trashPoints: undefined,
    error: undefined,
};

export const trashPointsReducer = (state, action = {}) => {
    switch (action.type) {
        case SEARCH_TRASH_POINTS_SUCCESS_ACTION:
            return state.withMutations(state => state
                .set('trashPoints', action.trashPoints)
            );
        default:
            return state;
    }
};