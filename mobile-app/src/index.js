import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { AsyncStorage, Image } from 'react-native';
import { AppLoading, Font, Asset, Constants, Location, Permissions } from 'expo';

import { I18nextProvider, translate } from 'react-i18next';

import store from './config/store';
import { actions } from './reducers/user';
import Navigator from './config/routes';
import { images, fonts } from './config/assets';
import { isAndroid } from './shared/helpers';
import { actions as trashpileActions } from './reducers/trashpile';
import { actions as appActions } from './reducers/app';
import './config/styles';
import i18n from './config/i18n';

import Api from './services/Api';
import { API_URL } from '../env';

const WrappedNavigator = () => {
  return <Navigator screenProps={{ t: i18n.getFixedT() }} />;
};

const ReloadAppOnLanguageChange = translate('common', {
  bindI18n: 'languageChanged',
  bindStore: false,
})(WrappedNavigator);

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

    if (isAndroid() && !Constants.isDevice) {
      console.log('This will not work on an android simulator!');
    } else {
      this.watchPositionAsync();
    }
  }

  componentWillUnmount() {
    this.locationUnsubscribe();
  }

  configAppAsync = async () => {
    try {
      await Promise.all([
        ...images.map((image) => {
          return typeof image === 'string'
            ? Image.prefetch(image)
            : Asset.fromModule(image).downloadAsync();
        }),
        Font.loadAsync(fonts),
        persistStore(store, {
          storage: AsyncStorage,
          debounce: 100,
        }),
      ]);

      const [types = { data: [] }, countries = { data: [] }] = await Promise.all([
        trashpileActions.fetchTrashpileTypes(),
        appActions.fetchCountries(),
      ]);

      store.dispatch(trashpileActions.setTrashpileTypes(types.data));
      store.dispatch(appActions.setCountries(countries.data));
    } catch (e) {
      // TODO handle errors for the users
      console.log(e.message);
    } finally {
      this.setState({ assetsLoaded: true });
    }
  };

  watchPositionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      // TODO handle errors for the users
      console.log('Persmission to access location was denied');
    }

    Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        timeInterval: 1000,
      },
      (data) => {
        const { coords: { latitude, longitude } } = data;
        store.dispatch(
          actions.setUserLocation({
            latitude,
            longitude,
          }),
        );
      },
    );
  };

  render() {
    if (this.state.assetsLoaded) {
      return (
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <ReloadAppOnLanguageChange />
          </I18nextProvider>
        </Provider>
      );
    }
    return <AppLoading />;
  }
}

export default App;
