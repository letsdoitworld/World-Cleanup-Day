import { Navigation } from 'react-native-navigation';

import ProfileScreen from './Profile';
import MyActivityScreen from './MyActivity/MyActivity'
import NotificationsScreen from './Notifications/Notifications'
import LoginScreen from './Login/Login'
import SettingsScreen from './Settings/Settings'
import AboutScreen from '../components/About/About'

import HomeScreen from './Home'
// import SecondTabScreen from './SecondTabScreen';
// import PushedScreen from './PushedScreen';

export const PROFILE_SCREEN = "PROFILE_SCREEN";
export const MY_ACTIVITY_SCREEN = "MY_ACTIVITY_SCREEN";
export const NOTIFICATIONS_SCREEN = "MY_ACTIVITY_SCREEN";
export const HOME_SCREEN = "HOME_SCREEN";
export const LOGIN_SCREEN = "LOGIN_SCREEN";
export const SETTINGS_SCREEN = "SETTINGS_SCREEN";
export const ABOUT_SCREEN = "ABOUT_SCREEN";

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
     Navigation.registerComponent(PROFILE_SCREEN, () => ProfileScreen, store, Provider);
     Navigation.registerComponent(MY_ACTIVITY_SCREEN, () => MyActivityScreen, store, Provider);
     Navigation.registerComponent(NOTIFICATIONS_SCREEN, () => NotificationsScreen, store, Provider);
     Navigation.registerComponent(HOME_SCREEN, () => HomeScreen, store, Provider);
     Navigation.registerComponent(LOGIN_SCREEN, () => LoginScreen, store, Provider);
     Navigation.registerComponent(SETTINGS_SCREEN, () => SettingsScreen, store, Provider);
     Navigation.registerComponent(ABOUT_SCREEN, () => AboutScreen, store, Provider);
    // Navigation.registerComponent('example.PushedScreen', () => PushedScreen);
}