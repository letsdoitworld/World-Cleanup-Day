import TYPES from './types';

const setErrorMessage = errorMessage => dispatch =>
dispatch({
  type: TYPES.SET_ERROR_MESSAGE,
  errorMessage,
});

const setErrorCode = errorCode => dispatch =>
dispatch({
  type: TYPES.SET_ERROR_CODE,
  errorCode,
});

const showErrorModal = () => dispatch =>
dispatch({
  type: TYPES.SHOW_ERROR_MODAL,
});

const hideErrorModal = () => dispatch =>
dispatch({
  type: TYPES.HIDE_ERROR_MODAL,
});


export default {
  setErrorMessage,
  setErrorCode,
  showErrorModal,
  hideErrorModal,
};
