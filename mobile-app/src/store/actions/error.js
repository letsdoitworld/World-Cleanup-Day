
export const SET_POPOVER_SHOWN = 'app/SET_POPOVER_SHOWN';
export const setPopoverShown = () => ({
  type: SET_POPOVER_SHOWN,
});

export const SET_POPOVER_MESSAGE = 'app/SET_POPOVER_MESSAGE';
export const setPopoverMessage = message => ({
  type: SET_POPOVER_MESSAGE,
  payload: message,
});
export const SET_ERROR_MESSAGE = 'app/SET_ERROR_MESSAGE';
export const setErrorMessage = (message) => {
  return {
    type: SET_ERROR_MESSAGE,
    payload: message,
  };
};
// export const setErrorMessage = (message) => {
//   console.log(message);
//   let payload = {};
//   if (typeof message === 'object') {
//     payload = message;
//   } else {
//     payload = {
//       message,
//       title: undefined,
//     };
//   }
//   return {
//     type: SET_ERROR_MESSAGE,
//     payload,
//   };
// };

export const HIDE_ERROR_MESSAGE = 'app/HIDE_ERROR_MESSAGE';
export const hideErrorMessage = () => {
  return {
    type: HIDE_ERROR_MESSAGE,
  };
};

export const SET_CONNECTION_CHECKED = 'SET_CONNECTION_CHECKED';
export const setConnectionChecked = () => ({
  type: SET_CONNECTION_CHECKED,
});

const UPDATE_NETWORK_STATUS = 'UPDATE_NETWORK_STATUS';
export const updateNetworkStatus = isConnected => ({
  type: UPDATE_NETWORK_STATUS,
  payload: { isConnected },
});
