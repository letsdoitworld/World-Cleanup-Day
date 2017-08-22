import { ApiService } from '../services';
import { DATASETS_TYPES, API_ENDPOINTS } from '../shared/constants';

export const TYPES = {
  FETCH_DATASETS_REQUEST: 'FETCH_DATASETS_REQUEST',
  FETCH_DATASETS_SUCCESS: 'FETCH_DATASETS_SUCCESS',
  FETCH_DATASETS_FAILED: 'FETCH_DATASETS_FAILED',
  SHOW_MODAL: 'SHOW_MODAL',
  HIDE_MODAL: 'HIDE_MODAL',
  TOGGLE_LOGIN_POPOVER: 'TOGGLE_LOGIN_POPOVER',
  HIDE_LOGIN_POPOVER: 'HIDE_LOGIN_POPOVER',
  SHOW_LOCKED_MODAL: 'SHOW_LOCKED_MODAL',
  HIDE_LOCKED_MODAL: 'HIDE_LOCKED_MODAL',
};

const appReducer = (
  state = {
    trashpointsDatasetUUID: '',
    showModal: false,
    showLoginPopover: false,
    showLockedModal: false,
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

    case TYPES.TOGGLE_LOGIN_POPOVER:
      return { ...state, showLoginPopover: !state.showLoginPopover };
    case TYPES.HIDE_LOGIN_POPOVER:
      return { ...state, showLoginPopover: false };
    case TYPES.SHOW_LOCKED_MODAL:
      return { ...state, showLockedModal: true };
    case TYPES.HIDE_LOCKED_MODAL:
      return { ...state, showLockedModal: false };
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

const toggleLoginPopover = () => dispatch =>
  dispatch({ type: TYPES.TOGGLE_LOGIN_POPOVER });

const hideLoginPopover = () => dispatch =>
  dispatch({ type: TYPES.HIDE_LOGIN_POPOVER });

export const actions = {
  fetchDatasets,
  showModal,
  hideModal,
  toggleLoginPopover,
  hideLoginPopover,
  toggleLockedModal,
};

const getAppState = state => state.app;
const getTrashpointsDatasetUUID = state =>
  getAppState(state).trashpointsDatasetUUID;
const getShowModal = state => getAppState(state).showModal;
const getModalContant = state => getAppState(state).modalContent;
const getShowLoginPopover = state => getAppState(state).showLoginPopover;
const getShowLockedModal = state => getAppState(state).showLockedModal;

export const selectors = {
  getTrashpointsDatasetUUID,
  getShowModal,
  getModalContant,
  getShowLoginPopover,
  getShowLockedModal,
};

export default appReducer;
