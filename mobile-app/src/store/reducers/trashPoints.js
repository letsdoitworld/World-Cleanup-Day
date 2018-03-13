import {
    SEARCH_TRASH_POINTS_SUCCESS_ACTION,
    CLEAR_TRASH_POINTS_ACTION
} from "../types/trashPoints";

import {createReducer} from '../helpers/createReducer';
import Immutable from "immutable";

export const initialState = Immutable.Map(
    {
        page: undefined,
        pageSize: undefined,
        trashPoints: undefined,
        error: undefined,
    });

const handlers = {
    [SEARCH_TRASH_POINTS_SUCCESS_ACTION]: (state, {trashPoints, page}) => {
        if (page > 0) {
            const currentTrashPoints = state.get('trashPoints');
            if (currentTrashPoints) {
                return state.withMutations(state => state
                    .set('trashPoints', currentTrashPoints.concat(trashPoints)));
            } else {
                return state
            }
        } else {
            return state.withMutations(state => state
                .set('trashPoints', trashPoints));
        }
    },
    [CLEAR_TRASH_POINTS_ACTION]: (state, {}) => {
        return state.withMutations(state => state
            .set('trashPoints', undefined)
        );
    },
};

export default createReducer(initialState, handlers);