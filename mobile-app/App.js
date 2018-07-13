import { PureComponent } from 'react';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import isNil from 'lodash/isNil';
import branch from 'react-native-branch';
import { setGuestSession } from './src/store/actions/auth';
import {
  EVENTS,
  EXPAND_SEARCH,
  LOGIN_SCREEN,
  PROFILE_SCREEN,
  registerScreens,
  TERMS_SCREEN,
  TRASH_POINTS,
  TEAMS_SCREEN,
} from './src/screens';
import './src/config/styles';
import { Icons } from './src/assets/images';
import {
  checkConnection,
  openEventModal,
  openTrashpointModal,
} from './src/shared/helpers';
import strings from './src/assets/strings';
import configureStore from './src/store/configureStore';


const store = configureStore();

checkConnection();
registerScreens(store, Provider);

branch.skipCachedEvents();
branch.subscribe(({ error, params }) => {
  if (error) {
    return;
  }

  if (params['+non_branch_link'] || !params['+clicked_branch_link']) {
    return;
  }

  const identifier = params.$canonical_identifier;
  const auth = store.getState().get('auth');
  const token = auth.get('token');
  const isGuestSession = auth.get('isGuestSession');
  if (!token && !isGuestSession) {
    return;
  }

  if (token && identifier) {
    Navigation.dismissModal();
  }

  const type = params.type;
  if (type === 'event') {
    if (!token) {
      store.dispatch(setGuestSession());
    }
    openEventModal(identifier);
  } else {
    const {
      name,
      address,
      amount,
      areas,
      composition,
      counter,
      createdAt,
      createdBy,
      creatorId,
      creatorName,
      creatorPictureURL,
      datasetId,
      hashtags,
      id,
      isIncluded,
      latitude,
      longitude,
      photos,
      status,
      updatedAt,
      updatedBy,
      updaterId,
      updaterName,
      updaterPictureURL,
    } = params;
    const trashpoint = {
      name,
      address,
      amount,
      areas: (areas && areas !== '') ? areas.split(',') : [],
      composition: (composition) ? composition.split(',') : [],
      counter: Number(counter),
      createdAt,
      createdBy,
      creator: {
        id: creatorId,
        name: creatorName,
        pictureURL: creatorPictureURL,
      },
      datasetId,
      hashtags: (hashtags && hashtags !== '') ? hashtags.split(',') : [],
      id,
      isIncluded: isIncluded === 'true',
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      photos: (photos && photos !== '') ? photos.split(',') : [],
      status,
      updatedAt,
      updatedBy,
      updater: {
        id: updaterId,
        name: updaterName,
        pictureURL: updaterPictureURL,
      },
    };
    if (!token) {
      store.dispatch(setGuestSession());
    }
    if (trashpoint && trashpoint.id) {
      openTrashpointModal(trashpoint);
    }
  }
});

export default class App extends PureComponent {
  static navigatorStyle = {
    statusBarColor: 'transparent',
    statusBarTextColorScheme: 'dark',
  }

  static loginScreen() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: LOGIN_SCREEN,
        animationType: 'slide-in',
      },
    });
  }

  static termsScreen() {
    Navigation.showModal({
      screen: TERMS_SCREEN,
      title: strings.label_header_tc,
    });
  }

  static mainScreen() {
    Navigation.startTabBasedApp({
      tabs: [
        {
          screen: TRASH_POINTS,
          label: strings.label_trashpoints,
          icon: Icons.Trashpoints,
          selectedIcon: Icons.TrashpointsActive,
          title: strings.label_trashpoints,
        },
        {
          screen: EVENTS,
          label: strings.label_events,
          icon: Icons.Event,
          selectedIcon: Icons.EventActive,
          title: '',
        },
        {
          screen: TEAMS_SCREEN,
          label: strings.label_teams,
          icon: Icons.GroupPeople,
          selectedIcon: Icons.TeamsActive,
          title: strings.label_teams,
        },
        {
          screen: PROFILE_SCREEN,
          label: strings.label_header_profile,
          icon: Icons.Profile,
          selectedIcon: Icons.Profile,
          title: strings.label_header_profile,
        },
      ],
      appStyle: {
        orientation: 'portrait',
        statusBarColor: 'transparent',
        statusBarTextColorScheme: 'dark',
        // Sets a specific orientation to the entire app.
        // Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
      },
    }).done();
  }

  static errorLightBox(error) {
    Navigation.showLightBox({
      screen: 'ERROR_MODAL',
      passProps: {
        error,
      },
      style: {
        backgroundBlur: 'dark',
        tapBackgroundToDismiss: true,
      },
    });
  }

  static async expandSearchLightBox() {
    const visibleScreenInstanceId = await Navigation.getCurrentlyVisibleScreenId();
    if (visibleScreenInstanceId) {
      Navigation.showLightBox({
        screen: EXPAND_SEARCH,
        passProps: {
          onPress: () => {
            if (Platform.OS === 'ios') {
              Navigation.dismissModal();
            }
            Navigation.dismissLightBox();
          },
        },
        style: {
          tapBackgroundToDismiss: true,
          backgroundBlur: 'dark',
        },
      });
    }
  }

  constructor() {
    super();
    store.subscribe(this.onStoreUpdate.bind(this));
    this.currentToken = null;
    this.currentError = undefined;
    this.terms = undefined;
    this.currentTrashCount = 0;
    this.currentEventsCount = 0;
  }

  onStoreUpdate() {
    const auth = store.getState().get('auth');
    const token = auth.get('token');
    const terms = auth.get('termsAgreed');
    const error = store.getState().get('error').get('error');
    const trashEmpty = store.getState().get('trashPoints').get('empty');
    const trashCount = store.getState().get('trashPoints').get('searchCount');
    const eventsEmpty = store.getState().get('events').get('empty');
    const eventsCount = store.getState().get('events').get('searchCount');
    const isGuestSession = auth.get('isGuestSession');
    if (this.currentToken !== token
      || this.isGuestSession !== isGuestSession
      || this.terms !== terms) {
      this.currentToken = token;
      this.isGuestSession = isGuestSession;
      this.terms = terms;
      this.startApp(token, terms, isGuestSession);
    }
    if (this.currentError !== error) {
      this.currentError = error;
      App.errorLightBox(error);
    }
    if ((this.currentTrashCount !== trashCount) && (trashEmpty)) {
      this.currentTrashCount = trashCount;
      App.expandSearchLightBox();
    }
    if ((this.currentEventsCount !== eventsCount) && (eventsEmpty)) {
      this.currentEventsCount = eventsCount;
      App.expandSearchLightBox();
    }
  }

  startApp(token, terms, isGuestSession) {
    if (isNil(token) && !isGuestSession) {
      App.loginScreen();
    } else if (!terms && !isGuestSession) {
      App.termsScreen();
    } else if (token || isGuestSession) {
      App.mainScreen();
    }
  }
}
