import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { AsyncStorage, Image } from 'react-native';
import { Font, Asset, Constants, Location, Permissions } from 'expo';

import store from './config/store';
import { actions } from './reducers/user';
import Navigator from './config/routes';
import { images, fonts } from './config/assets';
import { isAndroid } from './shared/helpers';
import { actions as trashpileActions } from './reducers/trashpile';
import './config/styles';

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
        ...images.map(image => {
          return typeof image === 'string'
            ? Image.prefetch(image)
            : Asset.fromModule(image).downloadAsync();
        }),
        ...fonts.map(font => Font.loadAsync(font)),
        persistStore(store, {
          storage: AsyncStorage,
          debounce: 100,
        }),
      ]);

      const [types = { data: [] }] = await Promise.all([
        trashpileActions.fetchTrashpileTypes(),
      ]);

      store.dispatch(trashpileActions.setTrashpileTypes(types.data));
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
      data => {
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
          <Navigator />
        </Provider>
      );
    }
    return null;
  }
}

export default App;
