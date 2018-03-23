import TYPES from './types';
// import events from './events.json';
import { getEventsList } from './selectors';
import { ApiService } from '../../services';
import { API_ENDPOINTS } from '../../shared/constants';

const toggleEventWindow = () => ({
  type: TYPES.TOGGLE_EVENT_WINDOW,
});

const fetchAllEventMarkers = (location, radius) =>
async (dispatch, getState) => {
  dispatch({ type: TYPES.FETCH_ALL_EVENT_MARKERS_REQUEST });
  let markers = [];
  const res = await ApiService.get(API_ENDPOINTS.FETCH_EVENTS, {
    params: {
      location,
      radius,
    },
  });
  if (!res) {
    dispatch({ type: TYPES.FETCH_ALL_EVENT_MARKERS_FAIL });
    return false;
  }
  const { data } = res;
  markers = data.map((ev) => {
    return {
      position: { lat: ev.location.latitude, lng: ev.location.longitude },
      id: ev.id,
      location: {
        longitude: ev.location.latitude,
        latitude: ev.location.longitude,
      },
    };
  });

  dispatch({
    type: TYPES.FETCH_ALL_EVENT_MARKERS_SUCCESS,
    markers,
  });
};

const fetchAllEvents = (location, radius) => async dispatch => {
  dispatch({ type: TYPES.FETCH_ALL_EVENTS_REQUEST });
  const res = await ApiService.get(API_ENDPOINTS.FETCH_EVENTS, {
    params: {
      location,
      radius,
    },
  });
  if (!res) {
    dispatch({ type: TYPES.FETCH_ALL_EVENTS_FAIL });
    return false;
  }
  const { data } = res;
  dispatch({
    type: TYPES.FETCH_ALL_EVENTS_SUCCESS,
    events: data,
  });
};

const fetchEventTitle = (id) => ({
  type: TYPES.FETCH_EVENT_TITLE,
  id,
});

const fetchEventDetails = id => (dispatch, getState) => {
  dispatch({ type: TYPES.FETCH_EVENT_DETAILS_REQUEST });
  const eventsArray = getEventsList(getState());
  const event = eventsArray.find(ev => ev.id === id);
  dispatch({
    type: TYPES.FETCH_EVENT_DETAILS_SUCCESS,
    event,
  });
};

export default {
  toggleEventWindow,
  fetchAllEventMarkers,
  fetchAllEvents,
  fetchEventTitle,
  fetchEventDetails,
};
