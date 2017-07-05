import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { actions } from '../../reducers/auth';

const Logout = ({ logout, navigation }) => {
  const handleLogoutPress = () => {
    logout();
    navigation.navigate('Login');
  };
  return (
    <TouchableOpacity onPress={handleLogoutPress}>
      <Text>Logout</Text>
    </TouchableOpacity>
  );
};
Logout.propTypes = {
  logout: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapDispatch = {
  logout: actions.logout,
};

export default connect(undefined, mapDispatch)(Logout);
