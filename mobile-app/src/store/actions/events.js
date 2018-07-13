import {
  CLEAN_EVENT,
  LOAD_EVENT,
  LOAD_EVENT_SUCCESS,
  LOAD_EVENTS_ERROR,
} from '../types/events';

export const SEARCH_EVENTS_ACTION = 'SEARCH_EVENTS_ACTION';
export const SEARCH_EVENTS_SUCCESS_ACTION = 'SEARCH_EVENTS_SUCCESS_ACTION';
export const SEARCH_EVENTS_ERROR_ACTION = 'SEARCH_EVENTS_ERROR_ACTION';
export const CLEAR_EVENTS_ACTION = 'CLEAR_EVENTS_ACTION';
export const IS_EVENTS_EMPTY = 'IS_EVENTS_EMPTY';
export const JOIN_EVENT = 'JOIN_EVENT';
export const DELETE_EVENT_ACTION = 'DELETE_EVENT_ACTION';
export const DELETE_EVENT_ACTION_SUCCESS = 'DELETE_EVENT_ACTION_SUCCESS';

export const searchEventsAction = (query, page, pageSize, location, viewPort) => ({
  type: SEARCH_EVENTS_ACTION,
  payload: {
    query,
    page,
    pageSize,
    location,
    viewPort,
  },
});

export const searchEventsSuccessAction = (events, page, pageSize) => ({
  type: SEARCH_EVENTS_SUCCESS_ACTION,
  payload: { events, page, pageSize },
});

export const deleteEvent = data => ({
  type: DELETE_EVENT_ACTION,
  payload: data,
});

export const deleteEventSuccess = () => ({
  type: DELETE_EVENT_ACTION_SUCCESS,
});

export const joinEvent = eventId => ({
  type: JOIN_EVENT,
  payload: eventId,
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

export const isEventsEmpty = parameters => ({
  type: IS_EVENTS_EMPTY,
  payload: parameters,
});
export const LOAD_EVENTS_FOR_MAP_ACTION = 'LOAD_EVENTS_FOR_MAP_ACTION';
export const loadEventsForMapAction = parameters => ({
  type: LOAD_EVENTS_FOR_MAP_ACTION,
  payload: parameters,
});

export const LOAD_EVENTS_FOR_MAP_SUCCESS = 'LOAD_EVENTS_FOR_MAP_SUCCESS';
export const loadEventsForMapSuccess = mapEvents => ({
  type: LOAD_EVENTS_FOR_MAP_SUCCESS,
  payload: mapEvents,
});

export const SHOW_NEW_DELTA = 'SHOW_NEW_DELTA';
export const showNewDeltaAction = newDelts => ({
  type: SHOW_NEW_DELTA,
  payload: newDelts,
});

export const LOAD_EVENTS_FOR_MAP_ERROR = 'LOAD_EVENTS_FOR_MAP_ERROR';
export const loadEventsForMapError = error => ({
  type: LOAD_EVENTS_FOR_MAP_ERROR,
  payload: error,
});

export const LOAD_EVENTS_FROM_CLUSTER_ACTION = 'LOAD_EVENTS_FROM_CLUSTER_ACTION';
export const loadEventsFromClusterAction = parameters => ({
  type: LOAD_EVENTS_FROM_CLUSTER_ACTION,
  payload: parameters,
});

export const CHANGE_VIEW_PROT_ACTION = 'CHANGE_VIEW_PROT_ACTION';
export const changeViewPortAction = viewPort => ({
  type: CHANGE_VIEW_PROT_ACTION,
  payload: viewPort,
});

export const CHANGE_REGION_ACTION = 'CHANGE_REGION_ACTION';
export const changeRegionAction = region => ({
  type: CHANGE_REGION_ACTION,
  payload: region,
});
