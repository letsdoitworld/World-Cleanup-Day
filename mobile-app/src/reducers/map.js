import axios from 'axios';

import { API_URL } from '../shared/constants';

const FETCH_MARKERS_REQUEST = 'FETCH_MARKERS_REQUEST';
const FETCH_MARKERS_SUCCESS = 'FETCH_MARKERS_SUCCESS';
const FETCH_MARKERS_FAILED = 'FETCH_MARKERS_FAILED';

const CREATE_MARKER_REQUEST = 'CREATE_MARKER_REQUEST';
const CREATE_MARKER_SUCCESS = 'CREATE_MARKER_SUCCESS';
const CREATE_MARKER_FAILURE = 'CREATE_MARKER_FAILURE';

const TOGGLE_POPOVER = 'TOGGLE_POPOVER';
const UPDATE_TEMPORARY_MARKER = 'UPDATE_TEMPORARY_MARKER';

const DEFAULT_STATE = {
  markers: [],
  loading: false,
  showPopover: false,
  homePopoverDisplays: 0,
};

export default (state = { ...DEFAULT_STATE }, action) => {
  switch (action.type) {
    case CREATE_MARKER_REQUEST:
    case FETCH_MARKERS_REQUEST:
      return { ...state, loading: true };
    case FETCH_MARKERS_SUCCESS:
      return { ...state, markers: action.markers, loading: false };
    case CREATE_MARKER_SUCCESS:
      return {
        ...state,
        markers: [...state.markers, action.marker],
        loading: false,
      };
    case TOGGLE_POPOVER:
      return {
        ...state,
        showPopover: !state.showPopover,
        homePopoverDisplays: 1,
      };
    case FETCH_MARKERS_FAILED:
    case CREATE_MARKER_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export const fetchMarkers = (northWest, southEast) => {
  // TODO send northWest, southEast viewport points to the server
  return async (dispatch) => {
    dispatch({ type: FETCH_MARKERS_REQUEST });
    try {
      const { data } = await axios.get(`${API_URL}/markers`);
      dispatch({
        type: FETCH_MARKERS_SUCCESS,
        markers: data.map(marker => ({ ...marker, isTrashPile: true })) || [],
      });
    } catch (e) {
      console.log(e.message);
      dispatch({ type: FETCH_MARKERS_FAILED });
    }
  };
};

export const createMarker = (marker) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_MARKER_REQUEST });
    try {
      const { data } = await axios.post(`${API_URL}/markers`, marker);
      dispatch({ type: CREATE_MARKER_SUCCESS, marker: data });
    } catch (e) {
      console.log(e.message);
      dispatch({ type: FETCH_MARKERS_FAILED });
    }
  };
};

export const togglePopover = () => {
  return {
    type: TOGGLE_POPOVER,
  };
};

export const actions = {
  createMarker,
  togglePopover,
};
