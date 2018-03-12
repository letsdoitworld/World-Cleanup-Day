import {
    SEARCH_EVENTS_SUCCESS_ACTION,
    CLEAR_EVENTS_ACTION
} from "../types/events";

import {createReducer} from '../helpers/createReducer';
import Immutable from "immutable";

export const initialState = Immutable.Map(
    {
        page: undefined,
        pageSize: undefined,
        events: undefined,
        error: undefined,
    });

const handlers = {
    [SEARCH_EVENTS_SUCCESS_ACTION]: (state, {events, page}) => {
        if (page > 0) {
            const currentEvents = state.get('events');
            if (currentEvents) {
                return state.withMutations(state => state
                    .set('events', currentEvents.concat(events)));
            } else {
                return state
            }
        } else {
            return state.withMutations(state => state
                .set('events', events));
        }
    },
    [CLEAR_EVENTS_ACTION]: (state, {}) => {
        return state.withMutations(state => state
            .set('events', undefined)
        );
    },
};

export default createReducer(initialState, handlers);