import TYPES from './types';
import { ApiService } from '../../services';
import {
  getDistanceBetweenPointsInMeters,
  getGridValue,
  guid,
} from '../../shared/helpers';
import { API_ENDPOINTS } from '../../shared/constants';
import { actions as appActions, selectors as appSelectors } from '../app';

const setGridValue = gridValue => ({ type: TYPES.SET_GRID_VALUE, gridValue });

const toggleEventWindow = () => ({
  type: TYPES.TOGGLE_EVENT_WINDOW,
});

const expandEventWindow = () => ({
  type: TYPES.EXPAND_EVENT_WINDOW,
});

const fetchAllEventMarkers = (
  viewPortLeftTopCoordinate,
  viewPortRightBottomCoordinate,
  mapSize,
) => async (dispatch, getState) => {
  dispatch({ type: TYPES.FETCH_ALL_EVENT_MARKERS_REQUEST });
  let datasetId = appSelectors.getTrashpointsDatasetUUID(getState());

  if (!datasetId) {
    try {
      await dispatch(appActions.fetchDatasets());
      datasetId = appSelectors.getTrashpointsDatasetUUID(getState());
    } catch (ex) {
      return dispatch({ type: TYPES.FETCH_ALL_EVENT_MARKERS_FAILED });
    }
  }

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
  const [clustersRes] = await Promise.all([
    ApiService.post(
      API_ENDPOINTS.FETCH_OVERVIEW_EVENT_CLUSTERS,
      {
        ...body,
      },
      {
        withToken: false,
      },
    ),
  ]);

  let markers = [];

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
        id: cluster.id,
      })),
    ];
  }

  if (!clustersRes) {
    return dispatch({ type: TYPES.FETCH_ALL_EVENT_MARKERS_FAILED });
  }

  dispatch({
    type: TYPES.FETCH_ALL_EVENT_MARKERS_SUCCESS,
    markers,
  });
};

const fetchEventsList = (pageSize, pageNumber, address) =>
async (dispatch, getState) => {
  const response = await ApiService.get('events',
    {
      params: {
        pageSize,
        pageNumber,
        address,
      },
    },
    {
      withToken: false,
    });
  if (!response) {
    dispatch({ type: TYPES.FETCH_ALL_EVENTS_FAIL });
    return false;
  }
  dispatch({
    type: TYPES.FETCH_ALL_EVENTS_SUCCESS,
    events: response.data.records,
  });
};

const fetchEventTitle = (id) => ({
  type: TYPES.FETCH_EVENT_TITLE,
  id,
});

const fetchEventDetails = eventId => async dispatch => {
  dispatch({ type: TYPES.FETCH_EVENT_DETAILS_REQUEST });
  const res = await ApiService.get(API_ENDPOINTS.FETCH_EVENT_DETAILS(eventId), {
    withToken: false,
  });
  if (!res) {
    dispatch({ type: TYPES.FETCH_EVENT_DETAILS_FAILED });
    return false;
  }
  dispatch({
    type: TYPES.FETCH_EVENT_DETAILS_SUCCESS,
    event: res.data,
  });
};

export default {
  toggleEventWindow,
  expandEventWindow,
  fetchAllEventMarkers,
  fetchEventsList,
  fetchEventTitle,
  fetchEventDetails,
};
