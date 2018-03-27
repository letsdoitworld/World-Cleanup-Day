import {
    SEARCH_EVENTS_ACTION,
    SEARCH_EVENTS_ERROR_ACTION,
    SEARCH_EVENTS_SUCCESS_ACTION,
    CLEAR_EVENTS_ACTION
} from '../types/events';

export const searchEventsAction = (query, page, pageSize, location) => ({
    type: SEARCH_EVENTS_ACTION,
    query,
    page,
    pageSize,
    location
});

export const searchEventsSuccessAction = (events, page, pageSize) => ({
    type: SEARCH_EVENTS_SUCCESS_ACTION,
    events,
    page,
    pageSize
});

export const searchEventsErrorAction = (error) => ({
    type: SEARCH_EVENTS_ERROR_ACTION,
    error
});

export const clearEventsAction = () => ({
    type: CLEAR_EVENTS_ACTION
});