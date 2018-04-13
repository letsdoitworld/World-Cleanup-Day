import React, {PureComponent} from 'react';
import {Provider} from 'react-redux';
import {Navigation} from 'react-native-navigation';

import isNil from 'lodash/isNil';

import {EVENTS, LOGIN_SCREEN, PROFILE_SCREEN, registerScreens, TRASH_POINTS} from './src/screens';

import './src/config/styles';

import {Icons} from './src/assets/images';

import strings from './src/assets/strings';
import configureStore from './src/store/configureStore';

const store = configureStore();

registerScreens(store, Provider);

export default class App extends PureComponent {

  constructor() {
    super();
    store.subscribe(this.onStoreUpdate.bind(this));
    this.currentToken = null;
  }

  onStoreUpdate() {
    const auth = store.getState().get('auth');
    const token = auth.get('token');

    const isGuestSession = auth.get('isGuestSession');
    if (this.currentToken !== token || this.isGuestSession !== isGuestSession) {
      this.currentToken = token;
      this.isGuestSession = isGuestSession;
      this.startApp(token, isGuestSession);
    }
  }

  startApp(token, isGuestSession) {
    if (isNil(token) && !isGuestSession) {
      App.loginScreen();
    } else {
      App.mainScreen();
    }
  }

  static loginScreen() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: LOGIN_SCREEN,
        animationType: 'slide-in',
      },
    });
  }

  static mainScreen() {
    Navigation.startTabBasedApp({
      tabs: [
        {
          screen: TRASH_POINTS,
          label: 'Trashpoints',
          icon: Icons.Trashpoints,
          selectedIcon: Icons.TrashpointsActive,
          title: 'Trashpoints',
        },
        {
          screen: EVENTS,
          label: 'Events',
          icon: Icons.Event,
          selectedIcon: Icons.EventActive,
          title: '',
        },
        {
          screen: PROFILE_SCREEN,
                    // Todo add strings
          label: 'Profile',
          icon: Icons.Profile,
          selectedIcon: Icons.Profile,
          title: strings.label_header_profile,
        },
      ],
      appStyle: {
        orientation: 'portrait', // Sets a specific orientation to the entire app. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
      },
    }).done();
  }

}
