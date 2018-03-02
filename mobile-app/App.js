import React, { Component } from 'react';
import { Image } from 'react-native'

import { Navigation } from 'react-native-navigation';

import {
    LOGIN_SCREEN,
    MY_ACTIVITY_SCREEN,
    NOTIFICATIONS_SCREEN,
    PROFILE_SCREEN,
    registerScreens
} from './src/screens';


import actions from "./src/reducers/user/actions";

import strings from './src/assets/strings'
import configureStore from "./src/store/configureStore";
import {Provider} from "react-redux";

import { Icons } from './src/assets/images';

const store = configureStore();

registerScreens(store, Provider);

export default class App extends Component {

    constructor() {
        super();
        store.subscribe(this.onStoreUpdate.bind(this));
        store.dispatch(actions.setToken(null));
    }

    onStoreUpdate() {
        const token = store.getState().get('auth').get('token');
        if (this.currentToken !== token) {
            this.currentToken = token;
            this.startApp();
        }
    }

    startApp() {
        const token = store.getState().get('auth').get('token');
        App.mainScreen();

        if (token === undefined || token === null) {
            App.loginScreen()
         } else {
            App.dismissLogin()
        }
    }

    static dismissLogin() {
        Navigation.dismissModal({
            animationType: 'slide-out'
        })
    }

    static loginScreen() {
        setTimeout(() => {
            Navigation.showModal({
                screen: LOGIN_SCREEN,
                animationType: 'slide-in'
            });
        }, 1)
    }

    static mainScreen() {
        Navigation.startTabBasedApp({
            tabs: [
                {
                    screen: NOTIFICATIONS_SCREEN,
                    label: 'Trashpoints',
                    icon: Icons.Trashpoints,
                    selectedIcon:  Icons.TrashpointsActive,
                    title: strings.label_header_notific
                },
                {
                    screen: MY_ACTIVITY_SCREEN,
                    label: 'Events',
                    icon: Icons.Event,
                    selectedIcon: Icons.EventActive,
                    title: strings.label_header_activity
                },
                {
                    screen: PROFILE_SCREEN,
                    //Todo add strings
                    label: 'Profile',
                    icon: Icons.Profile,
                    selectedIcon: Icons.Profile,
                    title: strings.label_header_profile
                }
            ],
        }, this.animationType = 'fade').done();
    }

}