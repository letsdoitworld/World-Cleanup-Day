import TYPES from './types';
import { ApiService } from '../../services';
import {
  getDistanceBetweenPointsInMeters,
  getGridValue,
} from '../../shared/helpers';
import { API_ENDPOINTS } from '../../shared/constants';
import { actions as appActions, selectors as appSelectors } from '../app';
import { actions as errorActions } from '../error';

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
  try {
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

    if (!clustersRes.data.length) {
      dispatch(appActions.showExpandAreaModal());
    }


    dispatch({
      type: TYPES.FETCH_ALL_EVENT_MARKERS_SUCCESS,
      markers,
    });
  } catch (e) {
    console.log(e);
    dispatch(errorActions.setErrorMessage('Failed to load event markers'));
  }
};

const fetchEventsList = (rectangle, pageSize, pageNumber, address) =>
async (dispatch) => {
  try {
    dispatch({ type: TYPES.FETCH_ALL_EVENTS_REQUEST });
    const response = await ApiService.get('events',
      {
        params: {
          rectangle,
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
    }

    dispatch({
      type: TYPES.FETCH_ALL_EVENTS_SUCCESS,
      events: response.data.records,
      pageSize: response.data.pageSize,
      pageNumber: response.data.pageNumber,
      total: response.data.total,
      totalPages: Math.ceil(response.data.total / response.data.pageSize),
    });
  } catch (e) {
    console.log(e);
    dispatch(errorActions.setErrorMessage('Failed to load events'));
  }
};

const fetchEventTitle = (id) => ({
  type: TYPES.FETCH_EVENT_TITLE,
  id,
});

const fetchEventDetails = eventId => async dispatch => {
  try {
    dispatch({ type: TYPES.FETCH_EVENT_DETAILS_REQUEST });
    const res = await ApiService.get(API_ENDPOINTS.FETCH_EVENT_DETAILS(eventId), {
      withToken: false,
    });
    if (!res) {
      dispatch({ type: TYPES.FETCH_EVENT_DETAILS_FAILED });
    }
    dispatch({
      type: TYPES.FETCH_EVENT_DETAILS_SUCCESS,
      event: res.data,
    });
    dispatch(appActions.setChosenMarkerCoordinates({
      ...res.data.location,
      mapFocusNeeded: true,
    }));
  } catch (e) {
    console.log(e);
    dispatch(errorActions.setErrorMessage('Failed to load event details'));
  }
};

const updateSearchResultViewport = viewport => dispatch => {
  dispatch({
    type: TYPES.UPDATE_SEARCH_RESULT_VIEWPORT,
    viewport,
  });
};

export default {
  toggleEventWindow,
  expandEventWindow,
  fetchAllEventMarkers,
  fetchEventsList,
  fetchEventTitle,
  fetchEventDetails,
  updateSearchResultViewport,
};
