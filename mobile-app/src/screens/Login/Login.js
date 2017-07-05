import React, { Component } from 'react';
import { View, StatusBar, Image, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { actions } from '../../reducers/auth';

import { SocialButton } from './components/SocialButton';
import { Logo } from '../../components/Logo';

import styles from './styles';

const callToActionText = "Let's clean up the world together!";

class Login extends Component {
  static propTypes = {
    facebookLogin: PropTypes.func.isRequired,
    googleLogin: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  gotoTabs = () => {
    this.props.navigation.navigate('Tabs');
  };

  handleFBPress = () => {
    this.props.facebookLogin().then(
      () => {
        this.gotoTabs();
      },
      () => {},
    );
  };
  handleGooglePress = () => {
    // TODO add google app id
    this.props.googleLogin().then(
      () => {
        this.gotoTabs();
      },
      () => {},
    );
  };
  handleSkipPress = () => {
    this.gotoTabs();
  };

  render() {
    return (
      <Image resizeMode="stretch" style={styles.image} source={require('./images/background.png')}>
        <StatusBar translucent barStyle="light-content" />

        <Logo style={styles.logo} />
        <Text style={styles.heading}> {callToActionText} </Text>
        <View style={styles.buttonContainer}>
          <SocialButton
            style={styles.button}
            text="Continue with Facebook"
            icon="facebook"
            color={styles.$fbButtonColor}
            onPress={this.handleFBPress}
          />
          <View style={styles.buttonSeparator} />
          <SocialButton
            style={styles.button}
            text="Continue with Google"
            icon="google"
            color={styles.$googleButtonColor}
            onPress={this.handleGooglePress}
          />
        </View>
        <TouchableOpacity style={styles.skipLogoutContainer} onPress={this.handleSkipPress}>
          <Text style={styles.skipLogout}>
            Try out the app without account
          </Text>
        </TouchableOpacity>
      </Image>
    );
  }
}

const mapDispatch = {
  facebookLogin: actions.facebookLogin,
  googleLogin: actions.googleLogin,
};

export default connect(undefined, mapDispatch)(Login);
