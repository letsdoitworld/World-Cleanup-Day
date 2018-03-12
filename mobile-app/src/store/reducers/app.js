import {
    PROGRESS_ACTION
} from "../types/app";

import {createReducer} from "../helpers/createReducer";
import Immutable from "immutable";

export const initialState = Immutable.Map(
    {
        progress: undefined,
    });

const handlers = {
    [PROGRESS_ACTION]: (state, {progress}) => {
        return state.withMutations(state => state
            .set('progress', progress)
        );
    }
};

export default createReducer(initialState, handlers);