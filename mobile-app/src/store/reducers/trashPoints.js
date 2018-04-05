import {
    SEARCH_TRASH_POINTS_SUCCESS_ACTION,
    CLEAR_TRASH_POINTS_ACTION,
    SHOW_NEW_DELTA_TRASH_POINTS_MAP_ACTION,
    LOAD_TRASH_POINTS_FOR_MAP_SUCCESS_ACTION,
    LOAD_TRASH_POINTS_FOR_MAP_ERROR_ACTION
} from "../types/trashPoints";

import {createReducer} from '../helpers/createReducer';
import Immutable from "immutable";

export const initialState = Immutable.Map(
    {
        page: undefined,
        pageSize: undefined,
        trashPoints: undefined,
        error: undefined,
        mapTrashPoints: undefined,
        newDelta: undefined,
    });

const handlers = {
    [SEARCH_TRASH_POINTS_SUCCESS_ACTION]: (state, {trashPoints, page}) => {
        if (page > 0) {
            const currentTrashPoints = state.get('trashPoints');
            if (currentTrashPoints) {
                return state.withMutations(mState => mState
                    .set('trashPoints', currentTrashPoints.concat(trashPoints)));
            } else {
                return state
            }
        } else {
            return state.withMutations(mState => mState
                .set('trashPoints', trashPoints));
        }
    },
    [CLEAR_TRASH_POINTS_ACTION]: (state) => {
        return state.withMutations(mState => mState
            .set('trashPoints', undefined)
        );
    },
    [LOAD_TRASH_POINTS_FOR_MAP_SUCCESS_ACTION]: (state, { payload }) => {
        return state.withMutations(mState => mState
            .set('mapTrashPoints', payload));
    },
    [LOAD_TRASH_POINTS_FOR_MAP_ERROR_ACTION]: (state, { payload }) => {
        return state.withMutations(mState => mState
            .set('error', payload));
    },
    [SHOW_NEW_DELTA_TRASH_POINTS_MAP_ACTION]: (state, { payload }) => {
        return state.withMutations(mState => mState
            .set('newDelta', payload));
    },
};

export default createReducer(initialState, handlers);