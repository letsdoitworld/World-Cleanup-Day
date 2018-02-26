import React, {Component} from "react";

import { Navigation } from 'react-native-navigation';

import {
    HOME_SCREEN, LOGIN_SCREEN,
    MY_ACTIVITY_SCREEN,
    NOTIFICATIONS_SCREEN,
    PROFILE_SCREEN,
    registerScreens
} from './src/screens';

import strings from './src/assets/strings'
import configureStore from "./src/store/configureStore";
import {Provider} from "react-redux";

const store = configureStore();

registerScreens(store, Provider);

export default class App extends Component {

    constructor() {
        super();
        this.startApp();
        store.subscribe(this.onStoreUpdate.bind(this));
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

        console.warn(token);

        if (token === undefined || token === null) {

            Navigation.startSingleScreenApp({
                screen: {
                    screen: LOGIN_SCREEN,
                    //title: 'Welcome',
                  //  navigatorStyle: styles.navigatorStyleAuth,
                    navigatorButtons: {},
                    appStyle: {
                        keepStyleAcrossPush: false
                    }
                },
            });
         } else {

            Navigation.startTabBasedApp({
                tabs: [
                    {
                        screen: PROFILE_SCREEN,
                        icon: require('./src/assets/images/icon_menu_profile.png'),
                        selectedIcon: require('./src/assets/images/icon_menu_profile_active.png'),
                        title: strings.label_header_profile
                    },
                    {
                        screen: MY_ACTIVITY_SCREEN,
                        icon: require('./src/assets/images/icon_menu_activity.png'),
                        selectedIcon: require('./src/assets/images/icon_menu_activity_active.png'),
                        title: strings.label_header_activity
                    },
                    {
                        screen: NOTIFICATIONS_SCREEN,
                        icon: require('./src/assets/images/icon_menu_updates.png'),
                        selectedIcon: require('./src/assets/images/icon_menu_updates_active.png'),
                        title: strings.label_header_notific
                    },
                    {
                        screen: HOME_SCREEN,
                        icon: require('./src/assets/images/icon_menu_map.png'),
                        selectedIcon: require('./src/assets/images/icon_menu_map_active.png'),
                    },
                ]
            });
        }

    }

}