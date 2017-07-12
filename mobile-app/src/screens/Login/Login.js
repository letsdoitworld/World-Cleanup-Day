import React, { Component } from 'react';
import { View, StatusBar, Image, Text, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate } from 'react-i18next';

import { withNavigationHelpers } from '../../services/Navigation';

import { actions } from '../../reducers/auth';

import { SocialButton } from './components/SocialButton';
import { Logo } from '../../components/Logo';

import styles from './styles';

class Login extends Component {
  static propTypes = {
    facebookLogin: PropTypes.func.isRequired,
    googleLogin: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
  };

  gotoTabs = () => {
    this.props.navigation.dispatch(
      NavigationActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
      }),
    );
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
    const { t } = this.props;
    return (
      <Image resizeMode="stretch" style={styles.image} source={require('./images/background.png')}>
        <StatusBar translucent barStyle="light-content" />

        <Logo style={styles.logo} />
        <Text style={styles.heading}>{t('login:title')}</Text>
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

export default compose(connect(undefined, mapDispatch), withNavigationHelpers(), translate())(
  Login,
);
