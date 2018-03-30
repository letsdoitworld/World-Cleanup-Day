import {
    PROGRESS_ACTION,
} from "../types/app";
import {
    FETCH_DATASETS_SUCCESS,
    FETCH_DATASETS_FAILED,
} from "../actions/app";

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
        return state.withMutations(state => state
            .set('progress', progress)
        );
    },
    [FETCH_DATASETS_SUCCESS]: (state, { payload }) => {
        return state.withMutations(state => state
            .set('datasetUUID', payload)
        );
    },
    [FETCH_DATASETS_FAILED]: (state, { error }) => {
        return state.withMutations(state => state
            .set('error', error)
        );
    }
};

export default createReducer(initialState, handlers);