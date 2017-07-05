import React from 'react';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Text, Animated, Easing, View, StatusBar } from 'react-native';

import { STATUS_BAR_HEIGHT } from '../shared/constants';

import Home from '../screens/Home';
import Tabs from '../screens/Tabs';
import Login from '../screens/Login';
import CreateMarker from '../screens/CreateMarker';
import EditLocation from '../screens/EditLocation';
import { SimpleButton } from '../components/Buttons/';
import { getWidthPercentage } from '../shared/helpers';
import Details from '../screens/Details';

const HomeStack = StackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        header: () => null,
      },
    },
    Details: {
      screen: Details,
      navigationOptions: {
        title: 'Trashpoint details',
        headerTitleStyle: {
          fontFamily: 'noto-sans-bold',
          fontSize: 13,
        },
        headerBackTitleStyle: {},
      },
    },
  },
  {
    headerMode: 'screen',
  },
);

const TabStack = StackNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        header: () => null,
      },
    },
    Step2: {
      screen: ({ navigation }) => {
        return (
          <View style={{ flex: 1, paddingTop: 15 }}>
            <StatusBar />
            {/* <Logout navigation={navigation} />*/}
            <Text>Step2</Text>
          </View>
        );
      },
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
        header: () => null,
      },
    },
    Step4: {
      screen: () => {
        return (
          <View style={{ flex: 1, paddingTop: 15 }}>
            <StatusBar />
            <Text>Step4</Text>
          </View>
        );
      },
      navigationOptions: {
        header: () => null,
      },
    },
  },
  {
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,
        timing: Animated.timing,
        easing: Easing.step0,
      },
    }),
    cardStyle: {
      paddingTop: StatusBar.currentHeight,
    },
    headerMode: 'none',
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
      screen: ({ navigation }) => {
        return <Tabs navigation={navigation} tabs={TabStack} />;
      },
      navigationOptions: {
        header: null,
      },
    },
    CreateMarker: {
      screen: CreateMarker,
      navigationOptions: {
        title: 'Create trash point',
        headerStyle: {
          marginTop: STATUS_BAR_HEIGHT,
        },
      },
    },
    EditLocation: {
      screen: EditLocation,
      navigationOptions: ({ navigation }) => ({
        title: 'Edit location',
        headerTitleStyle: {
          fontFamily: 'noto-sans-bold',
          fontSize: 13,
        },
        headerStyle: {
          marginTop: STATUS_BAR_HEIGHT,
        },

        // TODO find a solution to centet the android title while having this button
        headerLeft: (
          <SimpleButton
            text="Cancel"
            onPress={() => navigation.dispatch(NavigationActions.back())}
            textStyles={{
              textDecorationLine: 'none',
              fontFamily: 'noto-sans-bold',
              fontSize: 13,
              marginLeft: getWidthPercentage(15),
            }}
          />
        ),
      }),
    },
  },
  {
    initialRouteName: 'Login',
  },
);

export default AppNavigator;
