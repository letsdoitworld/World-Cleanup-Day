import {PROGRESS_ACTION,} from "../types/app";
import {FETCH_DATASETS_FAILED, FETCH_DATASETS_SUCCESS, SET_ERROR_MESSAGE,} from "../actions/app";

import {createReducer} from "../helpers/createReducer";
import Immutable from "immutable";

export const initialState = Immutable.Map(
    {
        progress: undefined,
        datasetUUID: undefined,
        error: undefined,
    });

const handlers = {
    [PROGRESS_ACTION]: (state, {progress}) => {
        return state.withMutations(mState => mState
            .set('progress', progress)
        );
    },
    [FETCH_DATASETS_SUCCESS]: (state, { payload }) => {
        return state.withMutations(mState => mState
            .set('datasetUUID', payload)
        );
    },
    [FETCH_DATASETS_FAILED]: (state, { error }) => {
        return state.withMutations(mState => mState
            .set('error', error)
        );
    },
    [SET_ERROR_MESSAGE]: (state, { payload }) => {
        const currentError = state.get('error');
        if (payload && currentError &&  currentError.message !== payload.message || payload && !currentError || !payload) {
            return state.withMutations(mState => mState
                .set('error', payload)
            );
        }
        return state;
    },
};

export default createReducer(initialState, handlers);