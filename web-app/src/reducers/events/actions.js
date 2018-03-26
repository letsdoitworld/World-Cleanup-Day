import TYPES from './types';
// import events from './events.json';
import { getEventsList, getAllEventMarkers } from './selectors';
import { ApiService } from '../../services';
import { destinationPoint } from '../../shared/helpers';
import { API_ENDPOINTS } from '../../shared/constants';
import { actions as appActions, selectors as appSelectors } from '../app';

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

const fetchEventsList = (location, radius) => async dispatch => {
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

const fetchClusterEvents = ({
  cellSize,
  coordinates,
  clusterId,
}) => async (dispatch, getState) => {
  try {
    let datasetId = appSelectors.getTrashpointsDatasetUUID(getState());
    const markers = getAllEventMarkers(getState());

    if (!datasetId) {
      try {
        await dispatch(appActions.fetchDatasets());
        datasetId = appSelectors.getTrashpointsDatasetUUID(getState());
      } catch (ex) {
        return dispatch({ type: TYPES.FETCH_ALL_MARKERS_FAILED });
      }
    }

    const body = {
      datasetId,
      cellSize,
      coordinates,
    };
    const response = await ApiService.post(
      API_ENDPOINTS.FETCH_CLUSTER_TRASHPOINTS,
      body,
    );

    if (response && response.data && Array.isArray(response.data)) {
      const angleBetweenPoints = 360 / response.data.length;
      dispatch({
        type: TYPES.FETCH_ALL_MARKERS_SUCCESS,
        markers: [
          ...markers.filter(({ id }) => id !== clusterId),
          ...response.data.map((marker, index) => ({
            ...marker,
            position: destinationPoint(
              marker.location,
              3,
              index * angleBetweenPoints,
            ),
            isTrashpile: true,
          })),
        ],
      });
    }
  } catch (e) {
    console.log(e);
  }
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
  fetchEventsList,
  fetchClusterEvents,
  fetchEventTitle,
  fetchEventDetails,
};
