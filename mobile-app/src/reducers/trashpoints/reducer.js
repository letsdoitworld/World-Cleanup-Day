import {
    SEARCH_TRASH_POINTS_SUCCESS_ACTION,
    CLEAR_TRASH_POINTS_ACTION
} from "./types";

export const trashPointsInitialState = {
    page: undefined,
    pageSize: undefined,
    trashPoints: undefined,
    error: undefined,
};

export const trashPointsReducer = (state, action = {}) => {
    switch (action.type) {
        case SEARCH_TRASH_POINTS_SUCCESS_ACTION:
            if (action.page > 0) {
                return state.withMutations(state => state
                    .set('trashPoints', state.get('trashPoints').concat(action.trashPoints)));
            } else {
                return state.withMutations(state => state
                    .set('trashPoints', action.trashPoints));
            }
        case CLEAR_TRASH_POINTS_ACTION:
            return state.withMutations(state => state
                .set('trashPoints', undefined)
            );
        default:
            return state;
    }
};