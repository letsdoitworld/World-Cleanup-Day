import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';

import { Button } from '../Buttons';

import { connect } from 'react-redux';

import { actions } from '../../reducers/auth';

const Logout = ({ logout, navigation }) => {
  const handleLogoutPress = () => {
    logout();
    navigation.dispatch(
      NavigationActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: 'Login' })],
      }),
    );
  };
  return <Button text="Logout" onPress={handleLogoutPress} />;
};
Logout.propTypes = {
  logout: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapDispatch = {
  logout: actions.logout,
};

export default connect(undefined, mapDispatch)(Logout);
