import { combineReducers } from 'redux';
import types from './types';

const popoverInitialState = {
  shown: false,
  message: 'Join other people who are mapping trash!',
};
const errorInitialState = {
  visible: false,
  title: undefined,
  message: undefined,
};

const networkStatusState = {
  isConnected: false,
  connectionChecked: false,
  noLackConnectionAlert: false,
  inSync: false
};

const networkReducer = (state = networkStatusState, action) => {
  switch (action.type) {
    case types.SET_CONNECTION_CHECKED:
      return { ...state, connectionChecked: true };
    case types.UPDATE_NETWORK_STATUS:
      return { ...state, isConnected: action.payload.isConnected };
    case types.UPDATE_SYNC_STATUS:
      return { ...state, inSync: action.payload.inSync };
    case types.UPDATE_LACK_CONNECTION_MESSAGE_STATUS:
      return { ...state, noLackConnectionAlert: action.payload.noLackConnectionAlert };
    default:
      return state;
  }
};

const popoverReducer = (state = popoverInitialState, action) => {
  switch (action.type) {
    case types.SET_POPOVER_SHOWN:
      return { ...state, shown: true };
    case types.SET_POPOVER_MESSAGE:
      return { ...state, message: action.payload };
    default:
      return state;
  }
};
const errorReducer = (state = errorInitialState, action) => {
  switch (action.type) {
    case types.SET_ERROR_MESSAGE:
      return { ...state, ...action.payload, visible: true };
    case types.HIDE_ERROR_MESSAGE:
      return { ...state, visible: false };
    default:
      return state;
  }
};
const configReducer = (
  state = {
    trashpointsDatasetUUID: '',
    activeScreen: '',
  },
  action,
) => {
  switch (action.type) {
    case types.FETCH_DATASETS_REQUEST:
      return { ...state, loading: true };
    case types.FETCH_DATASETS_SUCCESS:
      return {
        ...state,
        loading: false,
        trashpointsDatasetUUID: action.trashpointsDatasetUUID,
      };
    case types.FETCH_DATASETS_FAILED:
      return { ...state, loading: false };
    case types.SET_ACTIVE_SCREEN:
      return { ...state, activeScreen: action.activeScreen };
    default:
      return state;
  }
};

export default combineReducers({
  popover: popoverReducer,
  error: errorReducer,
  config: configReducer,
  network: networkReducer,
});
