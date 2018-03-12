import TYPES from './types';
import events from './events.json';

/*
import selectors from './selectors';
import {
  API_ENDPOINTS,
} from '../../shared/constants';
import {
  getDistanceBetweenPointsInMeters,
  getGridValue,
  guid,
  destinationPoint,
} from '../../shared/helpers';
import { ApiService } from '../../services';
import { selectors as appSelectors } from '../app';
const setGridValue = gridValue => ({ type: TYPES.SET_GRID_VALUE, gridValue });
*/

const toggleEventWindow = () => ({
  type: TYPES.TOGGLE_EVENT_WINDOW,
});

const fetchAllEventMarkers = () => (dispatch, getState) => {
  dispatch({ type: TYPES.FETCH_ALL_EVENT_MARKERS_REQUEST });
  let markers = [];

  markers = getState().events.events.events.map((ev) => {
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

/*
const fetchAllMarkers = (
  viewPortLeftTopCoordinate,
  viewPortRightBottomCoordinate,
  mapSize,
) => async (dispatch, getState) => {
  dispatch({ type: TYPES.FETCH_ALL_MARKERS_REQUEST });
  const datasetId = appSelectors.getTrashpointsDatasetUUID(getState());

  const diagonaleInMeters = getDistanceBetweenPointsInMeters(
    viewPortLeftTopCoordinate.latitude,
    viewPortLeftTopCoordinate.longitude,
    viewPortRightBottomCoordinate.latitude,
    viewPortRightBottomCoordinate.longitude,
  );
  const grid = getGridValue(diagonaleInMeters);
  dispatch(setGridValue(grid));
  let cellSize = 0;
  if (
    viewPortRightBottomCoordinate.longitude >
    viewPortLeftTopCoordinate.longitude
  ) {
    cellSize =
      38 *
      (viewPortRightBottomCoordinate.longitude -
        viewPortLeftTopCoordinate.longitude) /
      mapSize.width;
  } else {
    cellSize =
      (180 -
        viewPortLeftTopCoordinate.longitude +
        viewPortRightBottomCoordinate.longitude +
        180) *
      38 /
      mapSize.width;
  }

  const body = {
    datasetId,
    rectangle: {
      nw: viewPortLeftTopCoordinate,
      se: viewPortRightBottomCoordinate,
    },
    cellSize,
  };

  const [markersRes, clustersRes] = await Promise.all([
    ApiService.post(API_ENDPOINTS.FETCH_OVERVIEW_TRASHPOINTS, body, {
      withToken: false,
    }),
    ApiService.post(
      API_ENDPOINTS.FETCH_OVERVIEW_CLUSTERS,
      {
        ...body,
      },
      {
        withToken: false,
      },
    ),
  ]);

  let markers = [];

  if (markersRes && markersRes.data && Array.isArray(markersRes.data)) {
    markers = [
      ...markersRes.data.map(marker => ({
        ...marker,
        position: {
          lat: marker.location.latitude,
          lng: marker.location.longitude,
        },
        isTrashpile: true,
      })),
    ];
  }

  if (clustersRes && clustersRes.data && Array.isArray(clustersRes.data)) {
    markers = [
      ...markers,
      ...clustersRes.data.map(cluster => ({
        ...cluster,
        position: {
          lat: cluster.location.latitude,
          lng: cluster.location.longitude,
        },
        isTrashpile: true,
        id: guid(),
      })),
    ];
  }

  if (!markersRes && !clustersRes) {
    return dispatch({ type: TYPES.FETCH_ALL_MARKERS_FAILED });
  }

  dispatch({
    type: TYPES.FETCH_ALL_MARKERS_SUCCESS,
    markers,
  });
};

const fetchClusterEvents = ({
  cellSize,
  coordinates,
  clusterId,
}) => async (dispatch, getState) => {
  try {
    const datasetId = appSelectors.getTrashpointsDatasetUUID(getState());
    const markers = selectors.getAllEventMarkers(getState());
    console.log('fetchClusterEvents', datasetId, markers);
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
*/

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
  const state = getState();
  const event = state.events.events.events.find(ev => ev.datasetId === id);
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
