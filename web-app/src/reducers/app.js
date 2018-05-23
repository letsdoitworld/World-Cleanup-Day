import { ApiService } from '../services';
import { DATASETS_TYPES, API_ENDPOINTS } from '../shared/constants';

export const TYPES = {
  FETCH_DATASETS_REQUEST: 'FETCH_DATASETS_REQUEST',
  FETCH_DATASETS_SUCCESS: 'FETCH_DATASETS_SUCCESS',
  FETCH_DATASETS_FAILED: 'FETCH_DATASETS_FAILED',
  SHOW_MODAL: 'SHOW_MODAL',
  HIDE_MODAL: 'HIDE_MODAL',
  SHOW_SHARE_MODAL: 'SHOW_SHARE_MODAL',
  HIDE_SHARE_MODAL: 'HIDE_SHARE_MODAL',
  TOGGLE_LOGIN_POPOVER: 'TOGGLE_LOGIN_POPOVER',
  HIDE_LOGIN_POPOVER: 'HIDE_LOGIN_POPOVER',
  SHOW_LOCKED_MODAL: 'SHOW_LOCKED_MODAL',
  HIDE_LOCKED_MODAL: 'HIDE_LOCKED_MODAL',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_CURRENT_LOCATION: 'SET_CURRENT_LOCATION',
};

const appReducer = (
  state = {
    trashpointsDatasetUUID: '',
    showModal: false,
    showShareModal: false,
    showLoginPopover: false,
    showLockedModal: false,
    currentTabActive: 'trashpoints',
    currentLocation: {},
  },
  action,
) => {
  switch (action.type) {
    /* Fetch datasets */
    case TYPES.FETCH_DATASETS_REQUEST:
      return { ...state, loading: true };
    case TYPES.FETCH_DATASETS_SUCCESS:
      return {
        ...state,
        loading: false,
        trashpointsDatasetUUID: action.trashpointsDatasetUUID,
      };
    case TYPES.FETCH_DATASETS_FAILED:
      return { ...state, loading: false };
    /* Handle shared modal */
    case TYPES.SHOW_MODAL:
      return { ...state, showModal: true };
    case TYPES.HIDE_MODAL:
      return { ...state, showModal: false };
    case TYPES.SHOW_SHARE_MODAL:
      return { ...state, showShareModal: true };
    case TYPES.HIDE_SHARE_MODAL:
      return { ...state, showShareModal: false };
    case TYPES.TOGGLE_LOGIN_POPOVER:
      return { ...state, showLoginPopover: !state.showLoginPopover };
    case TYPES.HIDE_LOGIN_POPOVER:
      return { ...state, showLoginPopover: false };
    case TYPES.SHOW_LOCKED_MODAL:
      return { ...state, showLockedModal: true };
    case TYPES.HIDE_LOCKED_MODAL:
      return { ...state, showLockedModal: false };
    case TYPES.SET_ACTIVE_TAB:
      return { ...state, currentTabActive: action.tabName };
    case TYPES.SET_CURRENT_LOCATION:
      return { ...state, currentLocation: action.currentLocation };
    default:
      return state;
  }
};

const fetchDatasets = () => async dispatch => {
  dispatch({ type: TYPES.FETCH_DATASETS_REQUEST });
  const response = await ApiService.get(API_ENDPOINTS.FETCH_DATASETS, {
    withToken: false,
  });

  if (!response) {
    return dispatch({ type: TYPES.FETCH_DATASETS_FAILED });
  }

  const { data } = response;
  dispatch({
    type: TYPES.FETCH_DATASETS_SUCCESS,
    trashpointsDatasetUUID: Array.isArray(data)
      ? data.find(({ type }) => type === DATASETS_TYPES.TRASHPOINTS).id
      : '',
  });
};

const showModal = modalContent => (dispatch, getState) => {
  if (!getShowModal(getState())) {
    dispatch({
      type: TYPES.SHOW_MODAL,
      modalContent,
    });
  }
};

const hideModal = () => (dispatch, getState) => {
  if (getShowModal(getState())) {
    dispatch({
      type: TYPES.HIDE_MODAL,
    });
  }
};

const toggleLockedModal = (show = true) => {
  if (show) {
    return {
      type: TYPES.SHOW_LOCKED_MODAL,
    };
  }
  return {
    type: TYPES.HIDE_LOCKED_MODAL,
  };
};

const showShareModal = () => dispatch =>
  dispatch({ type: TYPES.SHOW_SHARE_MODAL });

const hideShareModal = () => dispatch =>
  dispatch({ type: TYPES.HIDE_SHARE_MODAL });

const toggleLoginPopover = () => dispatch =>
  dispatch({ type: TYPES.TOGGLE_LOGIN_POPOVER });

const hideLoginPopover = () => dispatch =>
  dispatch({ type: TYPES.HIDE_LOGIN_POPOVER });

const setActiveTab = tabName => dispatch =>
  dispatch({
    type: TYPES.SET_ACTIVE_TAB,
    tabName,
  });

const setCurrentLocation = currentLocation => dispatch =>
  dispatch({
    type: TYPES.SET_CURRENT_LOCATION,
    currentLocation,
  });

export const actions = {
  fetchDatasets,
  showModal,
  hideModal,
  showShareModal,
  hideShareModal,
  toggleLoginPopover,
  hideLoginPopover,
  toggleLockedModal,
  setActiveTab,
  setCurrentLocation,
};

const getAppState = state => state.app;
const getTrashpointsDatasetUUID = state =>
  getAppState(state).trashpointsDatasetUUID;
const getShowModal = state => getAppState(state).showModal;
const getShowShareModal = state => getAppState(state).showShareModal;
const getModalContant = state => getAppState(state).modalContent;
const getShowLoginPopover = state => getAppState(state).showLoginPopover;
const getShowLockedModal = state => getAppState(state).showLockedModal;
const getCurrentActiveTab = state => getAppState(state).currentTabActive;
const getCurrentLocation = state => getAppState(state).currentLocation;

export const selectors = {
  getTrashpointsDatasetUUID,
  getShowModal,
  getShowShareModal,
  getModalContant,
  getShowLoginPopover,
  getShowLockedModal,
  getCurrentActiveTab,
  getCurrentLocation,
};

export default appReducer;
