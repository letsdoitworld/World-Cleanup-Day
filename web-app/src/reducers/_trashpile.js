import {
  API_ENDPOINTS,
  TRASHPOINT_IMAGE_TYPES,
  MARKER_STATUSES,
  AMOUNT_STATUSES,
} from '../shared/constants';
import {
  getDistanceBetweenPointsInMeters,
  getGridValue,
  guid,
} from '../shared/helpers';
import { ApiService } from '../services';
import { selectors as appSelectors } from './app';

export const TYPES = {
  FETCH_ALL_MARKERS_REQUEST: 'FETCH_ALL_MARKERS_REQUEST',
  FETCH_ALL_MARKERS_SUCCESS: 'FETCH_ALL_MARKERS_SUCCESS',
  FETCH_ALL_MARKERS_FAILED: 'FETCH_ALL_MARKERS_FAILED',
  FETCH_ADMIN_TRASHPOINTS_REQUEST: 'FETCH_ADMIN_TRASHPOINTS_REQUEST',
  FETCH_ADMIN_TRASHPOINTS_SUCCESS: 'FETCH_ADMIN_TRASHPOINTS_SUCCESS',
  FETCH_ADMIN_TRASHPOINTS_FAILED: 'FETCH_ADMIN_TRASHPOINTS_FAILED',
  FETCH_MARKER_DETAILS_REQUEST: 'FETCH_MARKER_DETAILS_REQUEST',
  FETCH_MARKER_DETAILS_FAILED: 'FETCH_MARKER_DETAILS_FAILED',
  FETCH_MARKER_DETAILS_SUCCESS: 'FETCH_MARKER_DETAILS_SUCCESS',
  RESET_ADMIN_TRASHPOINTS: 'RESET_ADMIN_TRASHPOINTS',
};

const INITIAL_STATE = {
  markers: [],
  loadingAllMarkers: false,
  loadingAdminTrashpoints: false,
  canLoadMoreAdmin: true,
  loadingMarkerDetails: false,
  markerDetails: {
    latlng: { latitude: 0, longitude: 0 },
    status: MARKER_STATUSES.regular,
    amount: AMOUNT_STATUSES[0],
    composition: [],
    hashtags: [],
    photos: [],
    mediumPhotos: [],
    thumbnails: [],
    name: '',
    address: '',
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    /* -----Requests-------*/
    case TYPES.FETCH_ALL_MARKERS_REQUEST:
      return { ...state, loadingAllMarkers: true };
    case TYPES.FETCH_ADMIN_TRASHPOINTS_REQUEST:
      return { ...state, loadingAdminTrashpoints: true };
    case TYPES.FETCH_MARKER_DETAILS_REQUEST:
      return { ...state, loadingMarkerDetails: true };

    /* -----Succeses------*/
    case TYPES.FETCH_ALL_MARKERS_SUCCESS:
      return { ...state, loadingAllMarkers: false, markers: action.markers };
    case TYPES.FETCH_ADMIN_TRASHPOINTS_SUCCESS:
      return {
        ...state,
        loadingAdminTrashpoints: false,
        canLoadMoreAdmin: action.canLoadMore,
        markers: [...state.markers, ...action.adminTrashpoints],
      };
    case TYPES.FETCH_MARKER_DETAILS_SUCCESS:
      return {
        ...state,
        loadingMarkerDetails: false,
        markerDetails: action.marker,
      };

    /* -----Errors-------*/
    case TYPES.FETCH_ALL_MARKERS_FAILED:
      return { ...state, loadingAllMarkers: false };
    case TYPES.FETCH_ADMIN_TRASHPOINTS_FAILED:
      return { ...state, loadingAdminTrashpoints: false };

    case TYPES.FETCH_MARKER_DETAILS_FAILED:
      return { ...state, loadingMarkerDetails: false };

    case TYPES.RESET_ADMIN_TRASHPOINTS:
      return { ...state, markers: [] };
    default:
      return state;
  }
};

const fetchAllMarkers = (
  viewPortLeftTopCoordinate,
  viewPortRightBottomCoordinate,
) => async (dispatch, getState) => {
  dispatch({ type: TYPES.FETCH_ALL_MARKERS_REQUEST });
  const datasetId = appSelectors.getTrashpointsDatasetUUID(getState());
  const body = {
    datasetId,
    rectangle: {
      nw: viewPortLeftTopCoordinate,
      se: viewPortRightBottomCoordinate,
    },
  };

  const diagonaleInMeters = getDistanceBetweenPointsInMeters(
    viewPortLeftTopCoordinate.latitude,
    viewPortLeftTopCoordinate.longitude,
    viewPortRightBottomCoordinate.latitude,
    viewPortRightBottomCoordinate.longitude,
  );
  const gridValue = getGridValue(diagonaleInMeters);

  const [markersRes, clustersRes] = await Promise.all([
    ApiService.post(API_ENDPOINTS.FETCH_OVERVIEW_TRASHPOINTS, body, {
      withToken: false,
    }),
    ApiService.post(
      API_ENDPOINTS.FETCH_OVERVIEW_CLUSTERS,
      {
        ...body,
        scale: gridValue,
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
      clustersRes.data.map(cluster => ({
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

export const fetchAdminTrashpoints = (
  pageSize,
  pageNumber,
) => async dispatch => {
  dispatch({ type: TYPES.FETCH_ADMIN_TRASHPOINTS_REQUEST });
  try {
    const response = await ApiService.get(
      `${API_ENDPOINTS.FETCH_ADMIN_TRASHPOINTS}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
    );
    if (!response) {
      return dispatch({
        type: TYPES.FETCH_ADMIN_TRASHPOINTS_FAILED,
      });
    }

    const adminTrashpoints = response.data &&
      Array.isArray(response.data.records)
      ? response.data.records.map(marker => ({
          ...marker,
          position: {
            lat: marker.location.latitude,
            lng: marker.location.longitude,
          },
          key: marker.id,
          isTrashpile: true,
        }))
      : [];

    dispatch({
      type: TYPES.FETCH_ADMIN_TRASHPOINTS_SUCCESS,
      adminTrashpoints,
      pageSize,
      pageNumber,
      canLoadMore: adminTrashpoints.length > 0,
    });
  } catch (e) {
    console.log(e);
    dispatch({
      type: TYPES.FETCH_ADMIN_TRASHPOINTS_FAILED,
    });
  }
};
export const resetAdminTrashpoints = () => ({
  type: TYPES.RESET_ADMIN_TRASHPOINTS,
});
const fetchMarkerDetails = markerId => async dispatch => {
  dispatch({ type: TYPES.FETCH_MARKER_DETAILS_REQUEST });
  const [imagesResponse, detailsResponse] = await Promise.all([
    ApiService.get(API_ENDPOINTS.FETCH_TRASHPOINT_IMAGES(markerId), {
      withToken: false,
    }),
    ApiService.get(API_ENDPOINTS.FETCH_TRASHPOINT_DETAILS(markerId), {
      withToken: false,
    }),
  ]);

  if (!imagesResponse || !detailsResponse) {
    return dispatch({ type: TYPES.FETCH_MARKER_DETAILS_FAILED });
  }

  const imageResponseIsArray = Array.isArray(imagesResponse.data);
  const photos = imageResponseIsArray ? imagesResponse.data : [];
  const thumbnails = imageResponseIsArray
    ? photos.filter(({ type }) => type === TRASHPOINT_IMAGE_TYPES.THUMBNAIL)
    : [];
  const mediumPhotos = imageResponseIsArray
    ? photos.filter(({ type }) => type === TRASHPOINT_IMAGE_TYPES.MEDIUM)
    : [];

  dispatch({
    type: TYPES.FETCH_MARKER_DETAILS_SUCCESS,
    marker: {
      ...detailsResponse.data,
      latlng: {
        latitude: detailsResponse.data.location.latitude,
        longitude: detailsResponse.data.location.longitude,
      },
      photos,
      thumbnails,
      mediumPhotos,
    },
  });
};

export const deleteImage = (markerId, imageId) =>
  ApiService.delete(API_ENDPOINTS.DELETE_IMAGE(markerId, imageId));

export const actions = {
  fetchAllMarkers,
  fetchAdminTrashpoints,
  fetchMarkerDetails,
  deleteImage,
  resetAdminTrashpoints,
    fetchAreaTrashpoints,
};

const getTrashpileState = state => state.trashpile;
const getAllMarkers = state => getTrashpileState(state).markers;
const getMarkerDetails = state => getTrashpileState(state).markerDetails;
const getAdminTrashpointsLoading = state =>
  getTrashpileState(state).loadingAdminTrashpoints;
const canLoadMoreAdminTrashpoints = state =>
  getTrashpileState(state).canLoadMoreAdmin;

export const selectors = {
  getAllMarkers,
  getMarkerDetails,
  getAdminTrashpointsLoading,
  canLoadMoreAdminTrashpoints,
};
