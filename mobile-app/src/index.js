import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { AsyncStorage, Image, View } from 'react-native';
import { AppLoading, Font, Asset } from 'expo';
import { I18nextProvider, translate } from 'react-i18next';
import { compose } from 'recompose';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import { persistStoreAsync } from './config/persist';
import { withLocationGuard } from './services/Location';
import { withNetworkGuard } from './services/Network';
import { withErrorModal } from './services/Error';
import { withCameraService } from './services/Camera';
import store from './config/store';
import Navigator from './config/routes';
import { images, fonts } from './config/assets';
import { operations as appOperations } from './reducers/app';
import './config/styles';

import i18n from './config/i18n';

import { Api } from './services';
import { API_URL } from '../env';

const WrappedNavigator = () => {
  return <Navigator screenProps={{ t: i18n.getFixedT() }} />;
};
// AsyncStorage.clear()
const AppNavigator = compose(
  translate('common', {
    bindI18n: 'languageChanged',
    bindStore: false,
  }),
  withNetworkGuard(),
  withLocationGuard(),
  withErrorModal(),
  withCameraService(),
)(WrappedNavigator);

Api.setBaseURL(API_URL);
class App extends Component {
  constructor() {
    super();

    this.state = {
      assetsLoaded: false,
    };
  }

  componentWillMount() {
    this.configAppAsync();
  }
  componentWillUnmount() {
    MessageBarManager.unregisterMessageBar();
  }

  configAppAsync = async () => {
    Promise.all([
      Asset.loadAsync(images),
      Font.loadAsync(fonts),
      persistStoreAsync({
        store,
        storage: AsyncStorage,
      }),
      store.dispatch(appOperations.fetchDatasets()),
    ]).then(
      () => {
        this.setState({ assetsLoaded: true });
      },
      (e) => {
        console.log(e.message);
      },
    );
  };
  registerMessageBarRef = (a) => {
    MessageBarManager.registerMessageBar(a);
  };

  render() {
    if (this.state.assetsLoaded) {
      return (
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <View style={{ flex: 1 }}>
              <AppNavigator />
              <MessageBar ref={this.registerMessageBarRef} />
            </View>
          </I18nextProvider>
        </Provider>
      );
    }
    return <AppLoading />;
  }
}

export default App;
