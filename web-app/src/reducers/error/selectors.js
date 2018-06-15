const errorState = state => state.error;
const getErrorMessage = state => errorState(state).errorMessage;
const getShowErrorModal = state => errorState(state).showErrorModal;

export default {
  errorState,
  getErrorMessage,
  getShowErrorModal,
};
