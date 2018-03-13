import React, { Component } from 'react';
import {
    View,
    ImageBackground,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Linking,
} from 'react-native';

import PropTypes from 'prop-types';

import debounce from 'lodash/debounce';

import strings from '../../assets/strings';

import { PRIVACY_URL, TERMS_URL } from '../../../env';

import { Backgrounds } from '../../assets/images';

import { SocialButton } from './components/SocialButton';
import { Logo } from '../../components/Logo';

import styles from './styles';

class Login extends Component {

  static navigatorStyle = {
    statusBarColor: 'transparent',
    drawUnderStatusBar: true,
    navBarHidden: true,
  };

  constructor(props) {
    super(props);

    this.handleFBPress = debounce(this.handleFBPress, 2000, {
      leading: true,
      trailing: false,
    });
    this.handleGooglePress = debounce(this.handleGooglePress, 2000, {
      leading: true,
      trailing: false,
    });

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
      <ImageBackground
        resizeMode="stretch"
        style={styles.image}
        source={Backgrounds.Login}
      >
        <Logo style={styles.logo} />
        <Text style={styles.heading}>
          {strings.label_text_app_subtitle}
        </Text>
        <View style={styles.buttonContainer}>
          <SocialButton
            style={styles.button}
            text={strings.label_button_facebook}
            icon="facebook"
            color={styles.$fbButtonColor}
            onPress={this.handleFBPress}
          />
          <View style={styles.buttonSeparator} />
          <SocialButton
            style={styles.button}
            text={strings.label_button_google}
            icon="google"
            color={styles.$googleButtonColor}
            onPress={this.handleGooglePress}
          />
        </View>
        <TouchableOpacity
          style={styles.skipLogoutContainer}
          onPress={this.handleSkipPress}
        >
          <Text style={styles.skipLogout}>
            {strings.label_button_try_app}
          </Text>
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
      </ImageBackground>
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
