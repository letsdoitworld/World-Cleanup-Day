import TYPES from './types';
import events from './events.json';
import { getEventsList } from './selectors';

const toggleEventWindow = () => ({
  type: TYPES.TOGGLE_EVENT_WINDOW,
});

const fetchAllEventMarkers = () => (dispatch, getState) => {
  dispatch({ type: TYPES.FETCH_ALL_EVENT_MARKERS_REQUEST });
  let markers = [];
  const eventsArray = getEventsList(getState());
  markers = eventsArray.map((ev) => {
    return {
      position: { lat: ev.location_lat, lng: ev.location_lon },
      id: ev.datasetId,
      location: { longitude: ev.location_lon, latitude: ev.location_lat },
      status: 'regular',
      isTrashpile: true,
    };
  });

  dispatch({
    type: TYPES.FETCH_ALL_EVENT_MARKERS_SUCCESS,
    markers,
  });
};

const fetchAllEvents = () => dispatch => {
  dispatch({ type: TYPES.FETCH_ALL_EVENTS_REQUEST });
  dispatch({
    type: TYPES.FETCH_ALL_EVENTS_SUCCESS,
    events,
  });
};

const fetchEventTitle = (id) => ({
  type: TYPES.FETCH_EVENT_TITLE,
  id,
});

const fetchEventDetails = id => (dispatch, getState) => {
  dispatch({ type: TYPES.FETCH_EVENT_DETAILS_REQUEST });
  const eventsArray = getEventsList(getState());
  const event = eventsArray.find(ev => ev.datasetId === id);
  dispatch({
    type: TYPES.FETCH_EVENT_DETAILS_SUCCESS,
    event,
  });
  return event;
};

export default {
  toggleEventWindow,
  fetchAllEventMarkers,
  fetchAllEvents,
  fetchEventTitle,
  fetchEventDetails,
};
