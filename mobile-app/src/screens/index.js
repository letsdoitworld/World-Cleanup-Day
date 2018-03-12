import { Navigation } from 'react-native-navigation';

import ProfileScreen from './Profile';
import MyActivityScreen from './MyActivity/MyActivity'
import NotificationsScreen from './Notifications/Notifications'
import LoginScreen from './Login/Login'
import SettingsScreen from './Settings/Settings'
import AboutScreen from '../components/About/About'
import EventsScreen from './Events/Events'
import AddLocationScreen from './AddLocation/AddLocation'
import AddTrashPointsScreen from './AddTrashPoints/AddTrashPoints'
import CreateEventScreen from './Events/CreateEvent/CreateEvent'
import AddCoordinatorScreen from './Events/CreateEvent/AddCoordinator'
import AddPeopleToEventScreen from './Events/CreateEvent'

import HomeScreen from './Home'

export const PROFILE_SCREEN = "PROFILE_SCREEN";
export const MY_ACTIVITY_SCREEN = "MY_ACTIVITY_SCREEN";
export const NOTIFICATIONS_SCREEN = "MY_ACTIVITY_SCREEN";
export const HOME_SCREEN = "HOME_SCREEN";
export const LOGIN_SCREEN = "LOGIN_SCREEN";
export const SETTINGS_SCREEN = "SETTINGS_SCREEN";
export const ABOUT_SCREEN = "ABOUT_SCREEN";
export const EVENTS = "EVENTS";
export const CREATE_EVENT = "CREATE_EVENT";
export const ADD_LOCATION = "ADD_LOCATION";
export const ADD_TRASH_POINTS = "ADD_TRASH_POINTS";
export const ADD_COORDINATOR = "ADD_COORDINATOR";
export const ADD_PEOPLE_TO_EVENT = "ADD_PEOPLE_TO_EVENT";

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
     Navigation.registerComponent(PROFILE_SCREEN, () => ProfileScreen, store, Provider);
     Navigation.registerComponent(MY_ACTIVITY_SCREEN, () => MyActivityScreen, store, Provider);
     Navigation.registerComponent(NOTIFICATIONS_SCREEN, () => NotificationsScreen, store, Provider);
     Navigation.registerComponent(HOME_SCREEN, () => HomeScreen, store, Provider);
     Navigation.registerComponent(LOGIN_SCREEN, () => LoginScreen, store, Provider);
     Navigation.registerComponent(SETTINGS_SCREEN, () => SettingsScreen, store, Provider);
     Navigation.registerComponent(ABOUT_SCREEN, () => AboutScreen, store, Provider);
     Navigation.registerComponent(EVENTS, () => EventsScreen, store, Provider);
     Navigation.registerComponent(CREATE_EVENT, () => CreateEventScreen, store, Provider);
     Navigation.registerComponent(ADD_LOCATION, () => AddLocationScreen, store, Provider);
     Navigation.registerComponent(ADD_COORDINATOR, () => AddCoordinatorScreen, store, Provider);
     Navigation.registerComponent(ADD_PEOPLE_TO_EVENT, () => AddPeopleToEventScreen, store, Provider);
     Navigation.registerComponent(ADD_TRASH_POINTS, () => AddTrashPointsScreen, store, Provider);
}