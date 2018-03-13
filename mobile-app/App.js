import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import isNil from 'lodash/isNil';

import {
    LOGIN_SCREEN,
    MY_ACTIVITY_SCREEN,
    NOTIFICATIONS_SCREEN,
    PROFILE_SCREEN,
    EVENTS,
    registerScreens,
} from './src/screens';

import './src/config/styles';

import { Icons } from './src/assets/images';


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

    if (this.currentToken !== token) {
      this.currentToken = token;
      this.startApp(token, isGuestSession);
    }

    if (this.isGuestSession !== isGuestSession) {
      this.isGuestSession = isGuestSession;
      this.startApp(token, isGuestSession);
    }
  }

  startApp(token, isGuestSession) {
    if (isGuestSession) {
      App.dismissLogin();
      App.mainScreen();
      return;
    }

    if (isNil(token)) {
      App.loginScreen();
      return;
    }

    App.dismissLogin();
    App.mainScreen();
  }

  static dismissLogin() {
    console.log('dismissLogin');
    Navigation.dismissModal({
      animationType: 'slide-out',
    });
  }

  static loginScreen() {
    console.log('loginScreen');
    setTimeout(() => {
      Navigation.showModal({
        screen: LOGIN_SCREEN,
        animationType: 'slide-in',
      });
    }, 1);
  }

  static mainScreen() {
    console.log('Main Screen');
    Navigation.startTabBasedApp({
      tabs: [
        {
          screen: NOTIFICATIONS_SCREEN,
          label: 'Notifications',
          icon: Icons.Trashpoints,
          selectedIcon: Icons.TrashpointsActive,
          title: strings.label_header_notific,
        },
        {
          screen: EVENTS,
          label: 'Activity',
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
    }, this.animationType = 'fade').done();
  }

}
