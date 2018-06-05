import { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import isNil from 'lodash/isNil';
import branch from 'react-native-branch';
import {
  setGuestSession,
} from './src/store/actions/auth';
import {
  EVENTS,
  LOGIN_SCREEN,
  PROFILE_SCREEN,
  registerScreens,
  TRASH_POINTS,
  TERMS_SCREEN,
} from './src/screens';
import './src/config/styles';
import { Icons } from './src/assets/images';
import { openEventModal, openTrashpointModal,
  checkConnection } from './src/shared/helpers';
import strings from './src/assets/strings';
import configureStore from './src/store/configureStore';


const store = configureStore();

checkConnection();
registerScreens(store, Provider);

branch.skipCachedEvents();
branch.subscribe(({ error, params }) => {
  if (error) {
    console.log(`Error from Branch: ${error}`);
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
      coordinates,
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
      isTrashpile,
      latitude,
      longitude,
      photos,
      lat,
      lng,
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
      coordinates: (coordinates) ? coordinates.split(',').map((item) => {
        return parseInt(item, 10);
      }) : [],
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
      isTrashpile: isTrashpile === 'true',
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      photos: (photos && photos !== '') ? photos.split(',') : [],
      position: {
        lat: Number(lat),
        lng: Number(lng),
      },
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
    openTrashpointModal(trashpoint);
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
      title: 'Terms and Conditions',
    });
  }
  static mainScreen() {
    Navigation.startTabBasedApp({
      tabs: [
        {
          screen: TRASH_POINTS,
          label: 'Trashpoints',
          icon: Icons.Trashpoints,
          selectedIcon: Icons.TrashpointsActive,
          title: 'Trashpoints',
        },
        {
          screen: EVENTS,
          label: 'Events',
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

  constructor() {
    super();
    store.subscribe(this.onStoreUpdate.bind(this));
    this.currentToken = null;
    this.currentError = undefined;
    this.terms = undefined;
  }

  onStoreUpdate() {
    const auth = store.getState().get('auth');
    const token = auth.get('token');
    const terms = auth.get('termsAgreed');
    const error = store.getState().get('error').get('error');

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
