import { Navigation } from 'react-native-navigation';

import ProfileScreen from './Profile/Profile';
import MyActivityScreen from './MyActivity/MyActivity'
import NotificationsScreen from './Notifications/Notifications'

import Home from './Home'
// import SecondTabScreen from './SecondTabScreen';
// import PushedScreen from './PushedScreen';

export const PROFILE_SCREEN = "PROFILE_SCREEN";
export const MY_ACTIVITY_SCREEN = "MY_ACTIVITY_SCREEN";
export const NOTIFICATIONS_SCREEN = "MY_ACTIVITY_SCREEN";
export const HOME_SCREEN = "HOME_SCREEN";
// register all screens of the app (including internal ones)
export function registerScreens() {
     Navigation.registerComponent(PROFILE_SCREEN, () => ProfileScreen);
     Navigation.registerComponent(MY_ACTIVITY_SCREEN, () => MyActivityScreen);
     Navigation.registerComponent(NOTIFICATIONS_SCREEN, () => NotificationsScreen);
     Navigation.registerComponent(HOME_SCREEN, () => Home);
    // Navigation.registerComponent('example.PushedScreen', () => PushedScreen);
}