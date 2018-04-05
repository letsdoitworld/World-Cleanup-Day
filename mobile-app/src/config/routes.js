import React from 'react';
import { StackNavigator, TabNavigator, TabBarBottom, NavigationActions } from 'react-navigation';
import { Image } from 'react-native';

import Home from '../screens/Home';
import Login from '../screens/Login';
import CreateMarker from '../screens/CreateMarker';
import EditLocation from '../screens/EditLocation';
import Details from '../screens/Details';
import Profile from '../screens/Profile';
import TeamProfile from '../screens/TeamProfile';
import Settings from '../screens/Settings';
import MyActivity from '../screens/MyActivity';
import Teams from '../screens/Teams';
import { Header, HEADER_BUTTONS_IMAGES } from '../components/Header';
import { CreateMarkerButton } from '../screens/CreateMarkerButton';
import {
  operations as trashpileOperations,
  actions as trashpileActions,
} from '../reducers/trashpile';
import { operations as appOperations } from '../reducers/app';

import i18n from './i18n';

import {
  operations as locOps,
  selectors as locSels,
} from '../reducers/location';
import store from './store';
import { AcceptTerms } from '../screens/AcceptTerms';
import EditTrashpoint from '../screens/EditTrashpoint';
import Notifications from '../screens/Notifications';
import { DenyTerms } from '../screens/DenyTerms';
import { Terms } from '../components/Terms';
import { Privacy } from '../components/Privacy';
import { About } from '../components/About';
import { setRootNav } from '../services/Navigation';
import { PrivacyAndTerms } from '../screens/PrivacyAndTerms';
import { TERMS_URL, PRIVACY_URL } from '../../env';

const homeImage = require('../assets/images/icon_menu_map.png');
const homeActiveImage = require('../assets/images/icon_menu_map_active.png');
const activtyImage = require('../assets/images/icon_menu_activity.png');
const activityActiveImage = require('../assets/images/icon_menu_activity_active.png');
const updatesImage = require('../assets/images/icon_menu_updates.png');
const updatesActiveImage = require('../assets/images/icon_menu_updates_active.png');
const profileImage = require('../assets/images/icon_menu_profile.png');
const profileActiveImage = require('../assets/images/icon_menu_profile_active.png');

function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

function getPrivacyAndTermsUriParam(navigationState) {
  const PRIVACY_AND_TERMS = 'PrivacyAndTerms';
  if (!navigationState) {
    return '';
  }

  if (
    navigationState.routeName &&
    navigationState.routeName === PRIVACY_AND_TERMS
  ) {
    return navigationState.params.uri;
  }

  if (getCurrentRouteName(navigationState) === PRIVACY_AND_TERMS) {
    return navigationState.routes[navigationState.index].params.uri;
  }

  return '';
}

const imageFor = ({ image, activeImage }) => ({ focused }) => {
  return (
    <Image
      source={focused ? activeImage : image}
      width={18}
      height={24}
      resizeMode="contain"
    />
  );
};

const HomeStack = StackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      header: () => null,
    },
  },
});

const ProfileStack = StackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      header: () =>
        <Header
          title={i18n.t('label_header_profile')}
          rightButtonImage={HEADER_BUTTONS_IMAGES.settings}
          onPressRightButton={() => {
            navigation.navigate('Settings');
          }}
        />,
    }),
  },
});

const MyActivityStack = StackNavigator({
  MyActivity: {
    screen: MyActivity,
    navigationOptions: () => ({
      header: () => <Header title={i18n.t('label_header_activity')} />,
    }),
  },
});

const NotificationsStack = StackNavigator({
  Notifications: {
    screen: Notifications,
    navigationOptions: () => ({
      header: () => <Header title={i18n.t('label_header_notific')} />,
    }),
  },
});

const TabStack = TabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarIcon: imageFor({
          image: homeImage,
          activeImage: homeActiveImage,
        }),
      },
    },
    MyActivity: {
      screen: MyActivityStack,
      navigationOptions: {
        tabBarIcon: imageFor({
          image: activtyImage,
          activeImage: activityActiveImage,
        }),
      },
    },
    CreateMarkerButton: {
      screen: CreateMarkerButton,
    },
    Notifications: {
      screen: NotificationsStack,
      navigationOptions: {
        tabBarIcon: imageFor({
          image: updatesImage,
          activeImage: updatesActiveImage,
        }),
      },
    },
    Step4: {
      screen: ProfileStack,
      navigationOptions: {
        tabBarIcon: imageFor({
          image: profileImage,
          activeImage: profileActiveImage,
        }),
      },
    },
  },
  {
    tabBarOptions: {
      showLabel: false,
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    backBehavior: 'none',
  },
);

const AppNavigator = StackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        header: () => null,
      },
    },
    PublicHome: {
      screen: Home,
      navigationOptions: ({ navigation }) => ({
        header: () =>
          <Header
            onPressLeftButton={() => navigation.goBack(null)}
            leftButtonImage={HEADER_BUTTONS_IMAGES.arrowBack}
            title={i18n.t('label_header_map')}
          />,
      }),
    },
    Tabs: {
      screen: TabStack,
      navigationOptions: {
        header: null,
      },
    },
    CreateMarker: {
      screen: CreateMarker,
      navigationOptions: ({ navigation }) => ({
        header: () =>
          <Header
            onPressLeftButton={() => {
              navigation.dispatch(NavigationActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Tabs' })]
              }))
            }}
            title={i18n.t('label_header_createTP')}
            titleLeftButton={i18n.t('label_button_cancel')}
          />,
      }),
    },
    EditTrashpoint: {
      screen: EditTrashpoint,
      navigationOptions: ({ navigation }) => ({
        header: () =>
          <Header
            onPressLeftButton={() => navigation.goBack(null)}
            title={i18n.t('label_header_editTP')}
            titleLeftButton={i18n.t('label_button_cancel')}
          />,
      }),
    },
    Details: {
      screen: Details,
      navigationOptions: ({ navigation }) => ({
        header: () =>
          <Header
            onPressLeftButton={() => navigation.goBack(null)}
            title={i18n.t('label_trash_details_header')}
            leftButtonImage={HEADER_BUTTONS_IMAGES.arrowBack}
          />,
      }),
    },
    AcceptTerms: {
      screen: AcceptTerms,
      navigationOptions: () => ({
        header: ({ navigation }) =>
          <Header
            onPressLeftButton={() => navigation.navigate('DenyTerms')}
            title={i18n.t('label_header_tc')}
            leftButtonImage={HEADER_BUTTONS_IMAGES.arrowBack}
          />,
        gesturesEnabled: false,
      }),
    },
    PrivacyAndTerms: {
      screen: ({ navigation }) =>
        <PrivacyAndTerms uri={getPrivacyAndTermsUriParam(navigation.state)} />,
      navigationOptions: () => ({
        header: ({ navigation }) => {
          const uri = getPrivacyAndTermsUriParam(navigation.state);
          let title = '';
          if (uri === TERMS_URL) {
            title = i18n.t('label_header_tc');
          } else if (uri === PRIVACY_URL) {
            title = i18n.t('label_privacy_policy_header');
          }
          return (
            <Header
              onPressLeftButton={() => navigation.goBack(null)}
              title={title}
              leftButtonImage={HEADER_BUTTONS_IMAGES.arrowBack}
            />
          );
        },
        gesturesEnabled: false,
      }),
    },
    Terms: {
      screen: () => <Terms style={{ alignSelf: 'center' }} />,
      navigationOptions: () => ({
        header: ({ navigation }) =>
          <Header
            onPressLeftButton={() => navigation.goBack(null)}
            title={i18n.t('label_header_tc')}
            leftButtonImage={HEADER_BUTTONS_IMAGES.arrowBack}
          />,
      }),
    },
    Privacy: {
      screen: () => <Privacy style={{ alignSelf: 'center' }} />,
      navigationOptions: () => ({
        header: ({ navigation }) =>
          <Header
            onPressLeftButton={() => navigation.goBack(null)}
            title={i18n.t('label_privacy_policy_header')}
            leftButtonImage={HEADER_BUTTONS_IMAGES.arrowBack}
          />,
      }),
    },
    About: {
      screen: () => <About style={{ alignSelf: 'center' }} />,
      navigationOptions: () => ({
        header: ({ navigation }) =>
          <Header
            onPressLeftButton={() => navigation.goBack(null)}
            title={i18n.t('label_about_header')}
            leftButtonImage={HEADER_BUTTONS_IMAGES.arrowBack}
          />,
      }),
    },
    EditLocation: {
      screen: EditLocation,
      navigationOptions: ({ navigation }) => ({
        header: () =>
          <Header
            onPressLeftButton={() => navigation.goBack(null)}
            title={i18n.t('label_button_createTP_editloc')}
            titleLeftButton={i18n.t('label_button_cancel')}
          />,
      }),
    },
    Settings: {
      screen: Settings,
      navigationOptions: ({ navigation }) => ({
        header: () =>
          <Header
            onPressLeftButton={() => navigation.goBack(null)}
            title={i18n.t('label_header_settings')}
            leftButtonImage={HEADER_BUTTONS_IMAGES.arrowBack}
          />,
      }),
    },
    Teams: {
      screen: Teams,
      navigationOptions: ({ navigation }) => ({
        header: () =>
          <Header
            onPressLeftButton={() => navigation.goBack(null)}
            title={i18n.t('label_teams_header')}
            leftButtonImage={HEADER_BUTTONS_IMAGES.arrowBack}
            containerStyle={{borderBottomWidth: 0}}
          />,
      }),
    },
    TeamProfile: {
      screen: TeamProfile,
      navigationOptions: ({ navigation }) => ({
        header: () =>
          <Header
            onPressLeftButton={() => navigation.goBack(null)}
            title={i18n.t('label_header_team_profile')}
            leftButtonImage={HEADER_BUTTONS_IMAGES.arrowBack}
          />,
      }),
    },
    DenyTerms: {
      screen: DenyTerms,
      navigationOptions: {
        header: () => null,
      },
    },
  },
  {
    initialRouteName: 'Login',
    headerMode: 'screen',
  },
);

export default () =>
  <AppNavigator
    ref={setRootNav}
    onNavigationStateChange={(prevState, currentState) => {
      const currentScreen = getCurrentRouteName(currentState);
      store.dispatch(appOperations.setActiveScreen(currentScreen));
      if (currentScreen === 'MyActivity') {
        store.dispatch(
          trashpileOperations.fetchUserTrashpoints({ reset: true }),
        );
      }
      if (currentScreen === 'Home') {
        store.dispatch(trashpileActions.resetMarkerDetails());

        if (!locSels.hasLocationActive(store.getState())) {
          store.dispatch(locOps.setErrorModalVisible());
        }
      }
      if (currentScreen === 'PublicHome') {
        if (!locSels.hasLocationActive(store.getState())) {
          store.dispatch(locOps.setErrorModalVisible());
        }
      }
    }}
  />;
