/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Image,
} from 'react-native';
import { PRIVACY_URL, TERMS_URL } from 'react-native-dotenv';

import PropTypes from 'prop-types';

import strings from '../../assets/strings';

import { SocialButton } from './components/SocialButton';
import { Logo } from '../../components/Logo';

import styles from './styles';

class Login extends Component {
  static navigatorStyle = {
    statusBarColor: 'transparent',
    statusBarTextColorScheme: 'dark',
    drawUnderStatusBar: true,
    navBarHidden: true,
  };

  constructor(props) {
    super(props);
    this.state = { loading: false };
  }

  handleFBPress = () => this.props.onLoginFacebook();

  handleGooglePress = () => this.props.onLoginGoogle();

  handleSkipPress = () => this.props.onSetGuestSession();

  handleLinkPress = link => () =>
    Linking.openURL(link).catch(err => console.error('An error occurred', err));

  render() {
    const { isProfileLoading } = this.props;
    const { loading } = this.state;
    if (isProfileLoading || loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View
        style={styles.image}
      >
        <Logo style={styles.logo} />
        <Text style={styles.heading}>
          {strings.label_text_app_subtitle}
        </Text>
        <View style={styles.buttonContainer}>
          <SocialButton
            style={styles.button}
            text={strings.label_button_facebook}
            icon={require('./images/icFb.png')}
            backgroundColor={styles.$fbButtonColor}
            color={styles.$fbButtonColor}
            onPressBtn={this.handleFBPress}
          />
          <View style={styles.buttonSeparator} />
          <SocialButton
            style={styles.button}
            text={strings.label_button_google}
            icon={require('./images/google.png')}
            backgroundColor={styles.$googleButtonColor}
            color={styles.$googleButtonColor}
            onPressBtn={this.handleGooglePress}
          />
        </View>
        <View style={styles.orContainer}>
          <Image style={styles.line} source={require('./images/line.png')} />
          <Text style={styles.orText}>{strings.label_or}</Text>
          <Image style={styles.line} source={require('./images/line.png')} />
        </View>
        <TouchableOpacity
          onPress={this.handleSkipPress}
        >
          <View style={styles.skipButton}>
            <Text style={styles.text}>
              {strings.label_button_try_app}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={this.handleLinkPress(TERMS_URL)}>
            <Text style={styles.skipLogout}>
              {strings.label_header_tc}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleLinkPress(PRIVACY_URL)}>
            <Text style={styles.skipLogout}>
              {strings.label_privacy_policy_header}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

Login.propTypes = {
  isProfileLoading: PropTypes.bool,
  onSetGuestSession: PropTypes.func,
  onLoginFacebook: PropTypes.func,
  onLoginGoogle: PropTypes.func,
};

export default Login;
