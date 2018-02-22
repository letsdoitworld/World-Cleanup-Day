import React, {Component} from "react";

import { Navigation } from 'react-native-navigation';

import {HOME_SCREEN, MY_ACTIVITY_SCREEN, NOTIFICATIONS_SCREEN, PROFILE_SCREEN, registerScreens} from './src/screens';

import strings from './src/assets/strings'

registerScreens();

export default class App extends Component {

    constructor() {
        super();
        this.startApp()
    }

    startApp() {

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
                    icon: require('./src/assets/images/icon_menu_updates.png'),
                    selectedIcon: require('./src/assets/images/icon_menu_updates_active.png'),
                    title: strings.label_header_notific
                },
            ]
        });

    }

}