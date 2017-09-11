import { combineReducers } from 'redux';

import { MARKER_STATUSES, AMOUNT_STATUSES } from '../../shared/constants';

import TYPES from './types';

// markers
const MARKERS_INITIAL_STATE = {
  markers: [],
  loading: false,
  error: false,
};
const markersReducer = (state = MARKERS_INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPES.FETCH_ALL_MARKERS_REQUEST:
      return { ...state, loading: true };
    case TYPES.FETCH_ALL_MARKERS_SUCCESS:
      return { ...state, loading: false, markers: action.markers };
    case TYPES.FETCH_ALL_MARKERS_FAILED:
      return { ...state, loading: false };
    case TYPES.CREATE_MARKER_SUCCESS: {
      const index = state.markers.findIndex(
        ({ id }) => action.marker.id === id,
      );
      const markerAlreadyExists = index !== -1;
      const newMarkers = [...state.markers];
      if (markerAlreadyExists) {
        newMarkers[index] = {
          ...state.markers[index],
          ...action.marker,
        };
      } else {
        newMarkers.push({ ...action.marker });
      }
      return {
        ...state,
        markers: newMarkers,
      };
    }
    case TYPES.DELETE_MARKER_SUCCESS:
      return {
        ...state,
        markers: state.markers.filter(m => m.id !== action.payload.markerId),
      };
    default:
      return state;
  }
};

const ADMIN_MARKERS_STATE = {
  markers: [],
  loading: false,
  error: false,
  canLoadMore: false,
};
const adminMarkersReducer = (state = ADMIN_MARKERS_STATE, action) => {
  switch (action.type) {
    case TYPES.FETCH_ADMIN_TRASHPOINTS_REQUEST:
      return { ...state, loading: true, error: false };
    case TYPES.FETCH_ADMIN_TRASHPOINTS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        canLoadMore: action.canLoadMore,
        markers: [...state.markers, ...action.adminTrashpoints],
      };
    case TYPES.FETCH_ADMIN_TRASHPOINTS_FAILED:
      return { ...state, loading: false, error: action.payload || true };
    case TYPES.RESET_ADMIN_TRASHPOINTS:
      return { ...state, markers: [] };
    case TYPES.CREATE_MARKER_SUCCESS: {
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
        markers: newMarkers,
      };
    }
    case TYPES.DELETE_MARKER_SUCCESS:
      return {
        ...state,
        markers: state.markers.filter(m => m.id !== action.payload.markerId),
      };
    default:
      return state;
  }
};
const MARKER_DETAILS_STATE = {
  marker: {
    position: { latitude: 0, longitude: 0 },
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
  loading: false,
  error: false,
};
const markerDetailsReducer = (state = MARKER_DETAILS_STATE, action) => {
  switch (action.type) {
    case TYPES.FETCH_MARKER_DETAILS_REQUEST:
      return { ...state, loading: true, marker: MARKER_DETAILS_STATE.marker };
    case TYPES.FETCH_MARKER_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        marker: action.marker,
      };
    case TYPES.CREATE_MARKER_SUCCESS:
      return {
        ...state,
        marker: action.marker,
      };
    case TYPES.FETCH_MARKER_DETAILS_FAILED:
      return { ...state, loading: false };
    case TYPES.DELETE_MARKER_SUCCESS:
      if (state.marker.id !== action.payload.markerId) {
        return state;
      }
      return {
        ...state,
        marker: MARKER_DETAILS_STATE.marker,
      };

    // DEFAULT
    default:
      return state;
  }
};

const GRID_INITIAL_STATE = {
  gridValue: undefined,
  gridValueToZoom: undefined,
  maxZoomedIn: false,
};
const gridReducer = (state = GRID_INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPES.SET_GRID_VALUE:
      return action.gridValue;
    default:
      return state;
  }
};

const MARKER_AREA_STATE = {
  markers: undefined,
  pageNumber: undefined,
  pageSize: 15,
  loading: false,
  error: false,
  canLoadMore: true,
  statusCounts: undefined,
};
const markerAreaReducer = (state = MARKER_AREA_STATE, action) => {
  switch (action.type) {
    case TYPES.FETCH_AREA_MARKERS:
      return {
        ...state,
        loading: true,
        error: false,
        canLoadMore: false,
      };
    case TYPES.FETCH_AREA_MARKERS_SUCESS:
      return {
        ...state,
        loading: false,
        error: false,
        pageNumber: action.payload.pageNumber,
        markers: (action.payload.reset ? [] : state.markers).concat(
          action.payload.markers,
        ),
        canLoadMore: action.payload.canLoadMore,
        statusCounts: action.payload.statusCounts,
      };
    case TYPES.FETCH_AREA_MARKERS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        canLoadMore: false,
      };
    case TYPES.RESET_AREA_TRASHPOINTS:
      return {
        ...state,
        markers: [],
        canLoadMore: false,
        pageNumber: 1,
      };
    default:
      return state;
  }
};
const MARKER_AREAS_STATE = {
  areas: {},
  areasTrashpoints: {},
};
const markerAreasReducer = (state = MARKER_AREAS_STATE, action) => {
  switch (action.type) {
    case TYPES.FETCH_AREA_MARKERS_SUCESS:
      return {
        ...state,
        areasTrashpoints: markerAreaReducer(state.areasTrashpoints, action),
      };
    case TYPES.RESET_AREA_TRASHPOINTS:
      return {
        ...state,
        areasTrashpoints: markerAreaReducer(state.areasTrashpoints, action),
      };
    default:
      return state;
  }
};

const MAP_STATE = {
  focusedLocation: undefined,
};

const mapReducer = (state = MAP_STATE, action) => {
  switch (action.type) {
    case TYPES.FOCUS_MAP_LOCATION:
      return {
        focusedLocation: action.payload.location,
      };
    default:
      return state;
  }
};

export default combineReducers({
  markers: markersReducer,
  admin: adminMarkersReducer,
  details: markerDetailsReducer,
  grid: gridReducer,
  markerAreas: markerAreasReducer,
  map: mapReducer,
});
