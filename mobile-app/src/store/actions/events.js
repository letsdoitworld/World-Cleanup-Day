import {
    SEARCH_EVENTS_ACTION,
    SEARCH_EVENTS_ERROR_ACTION,
    SEARCH_EVENTS_SUCCESS_ACTION,
    CLEAR_EVENTS_ACTION,
    LOAD_EVENT,
    LOAD_EVENT_SUCCESS,
    LOAD_EVENTS_ERROR,
    CLEAN_EVENT,
} from '../types/events';

export const searchEventsAction = (query, page, pageSize, location) => ({
  type: SEARCH_EVENTS_ACTION,
  query,
  page,
  pageSize,
  location,
});

export const searchEventsSuccessAction = (events, page, pageSize) => ({
    type: SEARCH_EVENTS_SUCCESS_ACTION,
    events,
    page,
    pageSize
});

export const searchEventsErrorAction = error => ({
  type: SEARCH_EVENTS_ERROR_ACTION,
  error,
});

export const clearEventsAction = () => ({
  type: CLEAR_EVENTS_ACTION,
});

export const loadEvent = data => ({
  type: LOAD_EVENT,
  payload: data,
});

export const cleanEvent = () => ({
  type: CLEAN_EVENT,
});

export const loadEventSuccess = data => ({
  type: LOAD_EVENT_SUCCESS,
  payload: data,
});

export const loadEventError = err => ({
  type: LOAD_EVENTS_ERROR,
  payload: err,
});
