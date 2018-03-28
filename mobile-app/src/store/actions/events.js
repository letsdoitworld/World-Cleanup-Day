
export const SEARCH_EVENTS_ACTION = 'SEARCH_EVENTS_ACTION';
export const SEARCH_EVENTS_SUCCESS_ACTION = 'SEARCH_EVENTS_SUCCESS_ACTION';
export const SEARCH_EVENTS_ERROR_ACTION = 'SEARCH_EVENTS_ERROR_ACTION';
export const CLEAR_EVENTS_ACTION = 'CLEAR_EVENTS_ACTION';
export const searchEventsAction = (query, page, pageSize, location) => ({
    type: SEARCH_EVENTS_ACTION,
    query,
    page,
    pageSize,
    location
});

export const searchEventsSuccessAction = (events, page, pageSize) => ({
    type: SEARCH_EVENTS_SUCCESS_ACTION,
    events: events,
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

export const LOAD_EVENTS_FOR_MAP_ACTION = 'LOAD_EVENTS_FOR_MAP_ACTION';
export const loadEventsForMapAction = parameters => ({
    type: LOAD_EVENTS_FOR_MAP_ACTION,
    payload: parameters
});

export const LOAD_EVENTS_FOR_MAP_SUCCESS = 'LOAD_EVENTS_FOR_MAP_SUCCESS';
export const loadEventsForMapSuccess = mapEvents => ({
    type: LOAD_EVENTS_FOR_MAP_SUCCESS,
    payload: mapEvents
});

export const SHOW_NEW_DELTA = 'SHOW_NEW_DELTA';
export const showNewDeltaAction = newDelts => ({
    type: LOAD_EVENTS_FOR_MAP_SUCCESS,
    payload: newDelts
});

export const LOAD_EVENTS_FOR_MAP_ERROR = 'LOAD_EVENTS_FOR_MAP_ERROR';
export const loadEventsForMapError = error => ({
    type: LOAD_EVENTS_FOR_MAP_ERROR,
    payload: error
});