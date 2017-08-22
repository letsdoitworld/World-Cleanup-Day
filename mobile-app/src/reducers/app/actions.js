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
export default {
  setPopoverShown,
  setPopoverMessage,
  setErrorMessage,
  setActiveScreen,
  hideErrorMessage,
};
