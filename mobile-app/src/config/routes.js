import React from 'react';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import { Text, View, StatusBar, Image } from 'react-native';

import Home from '../screens/Home';
import Login from '../screens/Login';
import CreateMarker from '../screens/CreateMarker';
import EditLocation from '../screens/EditLocation';
import Details from '../screens/Details';
import Profile from '../screens/Profile';
import Settings from '../screens/Settings';
import { Header, HEADER_BUTTONS_IMAGES } from '../components/Header';
import { Logout } from '../components/Logout';
import { CreateMarkerButton } from '../screens/CreateMarkerButton';
import store from '../config/store';
import { actions as trashpileActions } from '../reducers/trashpile';

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

const HomeStack = StackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      header: () => null,
    },
  },
});

const ProfileStack = StackNavigator({
  ProfileStack: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      header: () =>
        <Header
          title="My profile"
          rightButtonImage={HEADER_BUTTONS_IMAGES.settings}
          onPressRightButton={() => {
            console.log(navigation);
            navigation.navigate('Settings');
          }}
        />,
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
    Step2: {
      screen: ({ navigation }) => {
        return (
          <View style={{ flex: 1, paddingTop: 15 }}>
            <StatusBar />
            <Logout navigation={navigation} />
            <Text>Step2</Text>
          </View>
        );
      },
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
    Step3: {
      screen: () => {
        return (
          <View style={{ flex: 1, paddingTop: 15 }}>
            <StatusBar />
            <Text>Step3</Text>
          </View>
        );
      },
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
            onPressLeftButton={() => navigation.goBack(null)}
            title="Create a trashpoint"
            titleLeftButton="Cancel"
          />,
      }),
    },
    Details: {
      screen: Details,
      navigationOptions: ({ navigation }) => ({
        header: () =>
          <Header
            onPressLeftButton={() => navigation.goBack(null)}
            title="Trashpoint details"
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
            title="Edit location"
            titleLeftButton="Cancel"
          />,
      }),
    },
    Settings: {
      screen: Settings,
      navigationOptions: ({ navigation }) => ({
        header: () =>
          <Header
            onPressLeftButton={() => navigation.goBack(null)}
            title="Account settings"
            leftButtonImage={HEADER_BUTTONS_IMAGES.arrowBack}
          />,
      }),
    },
  },
  {
    initialRouteName: 'Login',
  },
);

export default () =>
  <AppNavigator
    onNavigationStateChange={(prevState, currentState) => {
      const currentScreen = getCurrentRouteName(currentState);
      if (currentScreen === 'Home') {
        store.dispatch(trashpileActions.resetTrashpileAddress());
      }
    }}
  />;
