import types from './types';


const setPopoverShown = () => ({
  type: types.SET_POPOVER_SHOWN,
});
const setPopoverMessage = message => ({
  type: types.SET_POPOVER_MESSAGE,
  payload: message,
});

const setErrorMessage = (message) => {
  let payload = {};
  if (typeof message === 'object') {
    payload = message;
  } else {
    payload = {
      message,
      title: undefined,
    };
  }
  return {
    type: types.SET_ERROR_MESSAGE,
    payload,
  };
};

const hideErrorMessage = () => {
  return {
    type: types.HIDE_ERROR_MESSAGE,
  };
};

const setActiveScreen = activeScreen => ({
  type: types.SET_ACTIVE_SCREEN,
  activeScreen,
});

const setConnectionChecked = () => ({ type: types.SET_CONNECTION_CHECKED });

const updateNetworkStatus = isConnected => ({ type: types.UPDATE_NETWORK_STATUS, payload: { isConnected } });

export const controlProgress = (progress) => ({
    type: types.PROGRESS_ACTION,
    progress,
});

export default {
  setPopoverShown,
  setPopoverMessage,
  setErrorMessage,
  setActiveScreen,
  hideErrorMessage,
  setConnectionChecked,
  updateNetworkStatus,
};
