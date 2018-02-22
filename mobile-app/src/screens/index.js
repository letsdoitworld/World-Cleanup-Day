import { Navigation } from 'react-native-navigation';

import ProfileScreen from './Profile/Profile';
// import SecondTabScreen from './SecondTabScreen';
// import PushedScreen from './PushedScreen';

export const PROFILE_SCREEN = "PROFILE_SCREEN";
// register all screens of the app (including internal ones)
export function registerScreens() {
     Navigation.registerComponent(PROFILE_SCREEN, () => ProfileScreen);
    // Navigation.registerComponent('example.SecondTabScreen', () => SecondTabScreen);
    // Navigation.registerComponent('example.PushedScreen', () => PushedScreen);
}