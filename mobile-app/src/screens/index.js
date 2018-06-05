import { Navigation } from 'react-native-navigation';

import AcceptTerms from './AcceptTerms';
import ProfileScreen from './Profile';
import MyActivityScreen from './MyActivity/MyActivity';
import NotificationsScreen from './Notifications';
import LoginScreen from './Login';
import SettingsScreen from './Settings';
import AboutScreen from '../components/About/About';
import EventsScreen from './Events';
import AddLocationScreen from './AddLocation/AddLocation';
import AddTrashPointsScreen from './AddTrashPoints';
import AddTrashPointsMap from './AddTrashPoints/Map/AddTrashPointsMap';
import EventDetailsScreen from './EventDetails';
import EventsTrashpointsScreen from './EventDetails/EventsTrashpoints';
import CreateEventScreen from './Events/CreateEvent/CreateEvent';
import AddCoordinatorScreen from './Events/CreateEvent/AddCoordinator';
import AddPeopleToEventScreen from './Events/CreateEvent';
import NavBar from './Events/NavBar/NavBar';
import ErrorModal from './ErrorModal';
import TrashPoints from './TrashPoints';
import TrashPoint from './TrashPoint/TrashPoint';
import CreateMarker from './CreateMarker';
import EventMenu from './EventDetails/EventsMenu';
import TrashPointMenu from './TrashPoint/TrashPointMenu';
import ExpandSearch from './EventMap/components/ExpandSearch';

export const TERMS_SCREEN = 'TERMS_SCREEN';
export const PROFILE_SCREEN = 'PROFILE_SCREEN';
export const MY_ACTIVITY_SCREEN = 'MY_ACTIVITY_SCREEN';
export const NOTIFICATIONS_SCREEN = 'MY_ACTIVITY_SCREEN';
export const HOME_SCREEN = 'HOME_SCREEN';
export const LOGIN_SCREEN = 'LOGIN_SCREEN';
export const SETTINGS_SCREEN = 'SETTINGS_SCREEN';
export const ABOUT_SCREEN = 'ABOUT_SCREEN';
export const ERROR_MODAL = 'ERROR_MODAL';
export const EVENTS = 'EVENTS';
export const CREATE_EVENT = 'CREATE_EVENT';
export const ADD_LOCATION = 'ADD_LOCATION';
export const ADD_TRASH_POINTS = 'ADD_TRASH_POINTS';
export const ADD_TRASH_POINTS_MAP = 'ADD_TRASH_POINTS_MAP';
export const ADD_COORDINATOR = 'ADD_COORDINATOR';
export const ADD_PEOPLE_TO_EVENT = 'ADD_PEOPLE_TO_EVENT';
export const NAV_BAR = 'NAV_BAR';
export const TRASH_POINT = 'TRASH_POINT';
export const TRASH_POINTS = 'TRASH_POINTS';
export const CREATE_MARKER = 'CREATE_MARKER';
export const EVENT_DETAILS_SCREEN = 'EVENT_DETAILS_SCREEN';
export const EVENTS_TRASHPOINTS_SCREEN = 'EVENTS_TRASHPOINTS_SCREEN';
export const EVENTS_MENU_SCREEN = 'EVENTS_MENU_SCREEN';
export const TRASH_POINT_MENU_SCREEN = 'TRASH_POINT_MENU_SCREEN';
export const EXPAND_SEARCH = 'EXPAND_SEARCH';
export function registerScreens(store, Provider) {
  Navigation.registerComponent(NAV_BAR, () => NavBar);
  Navigation.registerComponent(TERMS_SCREEN, () => AcceptTerms, store, Provider);
  Navigation.registerComponent(PROFILE_SCREEN, () => ProfileScreen, store, Provider);
  Navigation
    .registerComponent(MY_ACTIVITY_SCREEN, () => MyActivityScreen, store, Provider);
  Navigation
    .registerComponent(NOTIFICATIONS_SCREEN, () => NotificationsScreen, store, Provider);
  Navigation.registerComponent(LOGIN_SCREEN, () => LoginScreen, store, Provider);
  Navigation.registerComponent(SETTINGS_SCREEN, () => SettingsScreen, store, Provider);
  Navigation.registerComponent(ABOUT_SCREEN, () => AboutScreen, store, Provider);
  Navigation.registerComponent(EVENTS, () => EventsScreen, store, Provider);
  Navigation.registerComponent(CREATE_EVENT, () => CreateEventScreen, store, Provider);
  Navigation.registerComponent(ADD_LOCATION, () => AddLocationScreen, store, Provider);
  Navigation
    .registerComponent(ADD_COORDINATOR, () => AddCoordinatorScreen, store, Provider);
  Navigation.registerComponent(ADD_PEOPLE_TO_EVENT,
    () => AddPeopleToEventScreen, store, Provider);
  Navigation
    .registerComponent(ADD_TRASH_POINTS, () => AddTrashPointsScreen, store, Provider);
  Navigation
    .registerComponent(ADD_TRASH_POINTS_MAP, () => AddTrashPointsMap, store, Provider);
  Navigation.registerComponent(TRASH_POINT, () => TrashPoint, store, Provider);
  Navigation.registerComponent(TRASH_POINTS, () => TrashPoints, store, Provider);
  Navigation.registerComponent(CREATE_MARKER, () => CreateMarker, store, Provider);
  Navigation.registerComponent(ERROR_MODAL, () => ErrorModal, store, Provider);
  Navigation
    .registerComponent(EVENT_DETAILS_SCREEN, () => EventDetailsScreen, store, Provider);
  Navigation.registerComponent(EVENTS_TRASHPOINTS_SCREEN,
    () => EventsTrashpointsScreen, store, Provider);
  Navigation.registerComponent(EVENTS_MENU_SCREEN,
    () => EventMenu, store, Provider);
  Navigation.registerComponent(TRASH_POINT_MENU_SCREEN,
    () => TrashPointMenu, store, Provider);
  Navigation.registerComponent(EXPAND_SEARCH,
    () => ExpandSearch, store, Provider);
}
