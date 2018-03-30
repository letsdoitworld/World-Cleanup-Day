import {
    CREATE_TRASH_POINT_SUCCESS_ACTION,
    CREATE_TRASH_POINT_ERROR_ACTION
} from "../types/trashPoints";

import {createReducer} from '../helpers/createReducer';
import Immutable from "immutable";

export const initialState = Immutable.Map(
    {
        success: undefined,
        error: undefined
    });

const handlers = {
    [CREATE_TRASH_POINT_SUCCESS_ACTION]: (state) => {
        return state.withMutations(mState => mState
                .set('success', true)
                .set('error', undefined)
            );
    },
    [CREATE_TRASH_POINT_ERROR_ACTION]: (state, {error}) => {
        return state.withMutations(mState => mState
            .set('success', false)
            .set('error', error)
        );
    },
};

export default createReducer(initialState, handlers);