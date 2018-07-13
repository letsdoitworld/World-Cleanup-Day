import { setJSExceptionHandler } from 'react-native-exception-handler';
import { Navigation } from 'react-native-navigation';
import Promise from 'bluebird';
import strings from '../assets/strings';

export default () => {
  global.Promise = Promise;
  global.onunhandledrejection = function onunhandledrejection(error) {
    if (error instanceof Error) {
      Navigation.showModal({
        screen: 'ERROR_MODAL',
        title: strings.label_button_createTP_confirm_create,
        passProps: {
          error,
        },
      });
    }
  };
  const errorHandler = (e, isFatal) => {
    if (isFatal) {
      Navigation.showModal({
        screen: 'ERROR_MODAL',
        title: strings.label_button_createTP_confirm_create,
        passProps: {
          error: e,
        },
      });
    } else {
      console.log(e);
    }
  };

  setJSExceptionHandler(errorHandler, true);
};
