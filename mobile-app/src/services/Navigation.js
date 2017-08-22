import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { wrapDisplayName } from 'recompose';

import { NavigationActions } from 'react-navigation';

export let rootNav = undefined;

export const setRootNav = navigator => {
  rootNav = navigator;
};

const debounceMethod = method => {
  return _.debounce(method, 1000, {
    leading: true,
    trailing: false,
  });
};
const decomposeChildStateNavigation = ({ routeName, params = {}, action }) => {
  const navigationConfig = {
    routeName,
    params,
  };
  if (action) {
    navigationConfig.action = decomposeChildStateNavigation(action);
  }
  return NavigationActions.navigate(navigationConfig);
};

const bindResetTo = navigation => {
  const navigateChildRoute = ({ routeName, params, action }) => {
    navigation.navigate(routeName, params);
    if (action) {
      navigateChildRoute(action);
    }
  };
  const resetTo = (routeName, params = {}, action = undefined) => {
    navigation.dispatch(
      NavigationActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName, params })],
      }),
    );
    if (action) {
      navigateChildRoute(action);
    }
  };
  return resetTo;
};

const extendWithDebounce = navigation => {
  return {
    ...navigation,
    navigate: debounceMethod(navigation.navigate),
    goBack: debounceMethod(navigation.goBack),
    dispatch: debounceMethod(navigation.dispatch),
    setParams: debounceMethod(navigation.setParams),
    resetTo: bindResetTo(navigation),
  };
};

export const resetTo = (
  navigation,
  routeName,
  params = {},
  action = undefined,
) => {
  return bindResetTo(navigation)(routeName, params, action);
};

export const withNavigationHelpers = () => Component => {
  return class extends React.Component {
    static propTypes = {
      navigation: PropTypes.object.isRequired,
    };
    constructor(props) {
      super(props);
      this.state = {
        extendedNavigation: extendWithDebounce(props.navigation),
      };

      this.displayName = wrapDisplayName(Component, 'withNavigationHelpers');
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.navigation !== this.props.navigation) {
        this.setState({
          extendedNavigation: extendWithDebounce(nextProps.navigation),
        });
      }
    }

    render() {
      const { props } = this;
      const { extendedNavigation } = this.state;
      return <Component {...props} navigation={extendedNavigation} />;
    }
  };
};
