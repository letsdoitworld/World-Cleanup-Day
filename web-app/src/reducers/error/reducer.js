import TYPES from './types';

const ERROR_INITIAL_STATE = {
  errorMessage: '',
  errorCode: 0,
  showErrorModal: false,
};

const errorReducer = (state = ERROR_INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPES.SET_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: action.errorMessage,
      };
    case TYPES.SET_ERROR_CODE:
      return {
        ...state,
        errorCode: action.errorCode,
      };
    case TYPES.SHOW_ERROR_MODAL:
      return {
        ...state,
        showErrorModal: true,
      };
    case TYPES.HIDE_ERROR_MODAL:
      return {
        ...state,
        showErrorModal: false,
        errorMessage: '',
      };
    default:
      return state;
  }
};

export default errorReducer;
