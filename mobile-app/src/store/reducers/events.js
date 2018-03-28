import {
    SEARCH_EVENTS_SUCCESS_ACTION,
    CLEAR_EVENTS_ACTION,
    LOAD_EVENTS_FOR_MAP_ACTION,
    LOAD_EVENTS_FOR_MAP_SUCCESS,
    LOAD_EVENTS_FOR_MAP_ERROR, SHOW_NEW_DELTA
} from "../actions/events";

import {createReducer} from '../helpers/createReducer';
import Immutable from "immutable";

export const initialState = Immutable.Map(
    {
        page: undefined,
        pageSize: undefined,
        events: undefined,
        mapEvents: undefined,
        error: undefined,
        newDelta: undefined,
    });

const handlers = {
    [SEARCH_EVENTS_SUCCESS_ACTION]: (state, {events, page}) => {
        if (page > 0) {
            const currentEvents = state.get('events');
            if (currentEvents) {
                return state.withMutations(mState => mState
                    .set('events', currentEvents.concat(events)));
            } else {
                return state
            }
        } else {
            return state.withMutations(mState => mState
                .set('events', events));
        }
    },
    [CLEAR_EVENTS_ACTION]: (state) => {
        return state.withMutations(mState => mState
            .set('events', undefined)
        );
    },
    [LOAD_EVENTS_FOR_MAP_SUCCESS]: (state, { payload }) => {
        return state.withMutations(mState => mState
            .set('mapEvents', payload));
    },
    [LOAD_EVENTS_FOR_MAP_ERROR]: (state, { payload }) => {
        return state.withMutations(mState => mState
            .set('error', payload));
    },
    [SHOW_NEW_DELTA]: (state, { payload }) => {
        return state.withMutations(mState => mState
            .set('newDelta', payload));
    },
};

export default createReducer(initialState, handlers);