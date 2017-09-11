import { combineReducers } from 'redux';

import types from './types';
import { MARKER_STATUSES } from '../../shared/constants';
import { AMOUNT_STATUSES } from '../../components/AmountPicker';

const INITIAL_STATE = {
  markers: [],
  clusters: [],
  markerDetails: {
    latlng: { latitude: 0, longitude: 0 },
    status: MARKER_STATUSES.USER,
    amount: AMOUNT_STATUSES[0],
    composition: [],
    hashtags: [],
    photos: [],
    mediumPhotos: [],
    thumbnails: [],
  },
  loadingMarkers: false,
  loadingClusters: false,
  loading: false,
  gridValue: {
    gridValue: undefined,
    gridValueToZoom: undefined,
    maxZoomedIn: false,
  },
};

const markersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    /* -----Requests-------*/
    case types.FETCH_ALL_MARKERS_REQUEST:
      return { ...state, loadingMarkers: true };
    case types.FETCH_ALL_CLUSTERS_REQUEST:
      return { ...state, loadingClusters: true };
    case types.CREATE_MARKER_REQUEST:
      return { ...state, loading: true };
    case types.FETCH_MARKER_DETAILS_REQUEST:
      return { ...state };
    case types.FETCH_USER_TRASHPOINTS_REQUEST:
      return { ...state, loading: true };

    /* -----Succeses------*/
    case types.CREATE_MARKER_SUCCESS:
      const index = state.markers.findIndex(
        ({ id }) => action.marker.id === id,
      );
      let newMarkers = [];
      if (index !== -1) {
        newMarkers = [
          ...state.markers.slice(0, index),
          action.marker,
          ...state.markers.slice(index + 1),
        ];
      } else {
        newMarkers = [...state.markers, action.marker];
      }
      return {
        ...state,
        loading: false,
        markers: newMarkers,
        markerDetails: action.marker,
      };
    case types.FETCH_MARKER_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        markerDetails: action.marker,
      };
    case types.FETCH_USER_TRASHPOINTS_SUCCESS:
      return {
        ...state,
        loading: false,
        userTrashpoints: action.userTrashpoints,
      };
    case types.FETCH_ALL_MARKERS_SUCCESS:
      return { ...state, loadingMarkers: false, markers: action.markers };
    case types.FETCH_ALL_CLUSTERS_SUCCESS:
      return { ...state, loadingClusters: false, clusters: action.clusters };
    case types.RESET_MARKER_DETAILS:
      return { ...state, markerDetails: { ...INITIAL_STATE.markerDetails } };
    case types.SET_GRID_VALUE:
      return { ...state, gridValue: action.gridValue };

    /* -----Errors-------*/
    case types.FETCH_ALL_MARKERS_FAILED:
      return { ...state, loadingMarkers: false };
    case types.FETCH_ALL_CLUSTERS_FAILED:
      return { ...state, loadingClusters: false };
    case types.CREATE_MARKER_FAILED:
      return { ...state, loading: false };
    case types.FETCH_MARKER_DETAILS_FAILED:
      return { ...state };
    case types.FETCH_USER_TRASHPOINTS_FAILED:
      return { ...state, loading: false };
    case types.DELETE_MARKER:
      return {
        ...state,
        markerDeleting: true,
      };
    case types.DELETE_MARKER_ERROR:
      return {
        ...state,
        markerDeleting: false,
      };
    case types.DELETE_MARKER_SUCCESS:
      return {
        ...state,
        markerDeleting: false,
        markers: state.markers.filter(m => m.id !== action.payload.markerId),
        markerDetails: state.markerDetails.id === action.payload.markerId
          ? INITIAL_STATE.markerDetails
          : state.markerDetails,
      };
    default:
      return state;
  }
};

const USER_TRASHPOINTS_INITAL_STATE = {
  trashpoints: [],
  loading: false,
  error: false,
  pageSize: 10,
  page: undefined,
  initialLoad: false,
  endReached: false,
  refreshing: false,
};

const {
  USER_TRASHPOINTS_RESET,
  FETCH_USER_TRASHPOINTS_FAILED,
  FETCH_USER_TRASHPOINTS_REQUEST,
  FETCH_USER_TRASHPOINTS_SUCCESS,
} = types;
const userTrashpointsReducer = (
  state = USER_TRASHPOINTS_INITAL_STATE,
  action,
) => {
  if (action.meta && action.meta.logout) {
    return USER_TRASHPOINTS_INITAL_STATE;
  }

  switch (action.type) {
    case FETCH_USER_TRASHPOINTS_REQUEST:
      return {
        ...state,
        refreshing: action.payload.reset,
        loading: true,
        error: false,
      };
    case FETCH_USER_TRASHPOINTS_SUCCESS:
      const trashpoints = action.payload.reset ? [] : state.trashpoints;
      return {
        ...state,
        loading: false,
        error: false,
        trashpoints: trashpoints.concat(action.payload.trashpoints),
        page: action.payload.reset ? 2 : (state.page || 1) + 1,
        initialLoad: true,
        endReached: action.payload.endReached,
        refreshing: false,
      };
    case FETCH_USER_TRASHPOINTS_FAILED:
      return {
        ...state,
        error: true,
        loading: false,
        refreshing: false,
      };
    default:
      return state;
  }
};

export default combineReducers({
  trashpoints: markersReducer,
  userTrashpoints: userTrashpointsReducer,
});
