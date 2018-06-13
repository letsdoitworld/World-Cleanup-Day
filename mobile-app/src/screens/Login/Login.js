import React, { Component } from 'react';
import {
  View,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { translate } from 'react-i18next';
import _ from 'lodash';
import { LinearGradient } from 'expo';

import { withNavigationHelpers } from '../../services/Navigation';
import { withLoadingScreen } from '../../services/Loading';
import { fetchAddress } from '../../services/Location';
import { operations as teamsOperations } from '../../reducers/teams';
import { PRIVACY_URL, TERMS_URL } from '../../../env';

import {
  operations as userOperations,
  selectors as userSelectors,
} from '../../reducers/user';

import { selectors as locSels } from '../../reducers/location';

import { SocialButton } from './components/SocialButton';
import { Logo } from '../../components/Logo';
import Api from '../../services/Api';
import { COUNTRY_LIST } from '../../shared/constants';
import styles from './styles';

class Login extends Component {
  static propTypes = {
    agreedToTerms: PropTypes.bool.isRequired,
    facebookLogin: PropTypes.func.isRequired,
    googleLogin: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    isProfileLoading: PropTypes.bool.isRequired,
    profile: PropTypes.object,
    profileError: PropTypes.object,
    getProfile: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleFBPress = _.debounce(this.handleFBPress, 2000, {
      leading: true,
      trailing: false,
    });
    this.handleGooglePress = _.debounce(this.handleGooglePress, 2000, {
      leading: true,
      trailing: false,
    });

    this.state = { loading: false };
  }

  componentWillMount() {
    const { token, isAuthenticated } = this.props;
    if (isAuthenticated) {
      Api.setAuthToken(token);
      this.gotoTabs();
    }
  }
  gotoTabs = () => {
    // TODO move the get profile from here to a better place
    const {
      profile,
      getProfile,
      locationActive,
      location,
      updateProfile,
      fetchTeams
    } = this.props;
    const tabsGo = async userProfile => {
      // await fetchTeams();
      if (userProfile && userProfile.termsAcceptedAt) {
        this.props.navigation.resetTo('Tabs', {});
      } else {
        this.props.navigation.navigate('AcceptTerms');
      }
    };


    if (!profile) {
      getProfile().then(
        userProfile => {
          this.setState({ loading: false });
          if (!userProfile.country && locationActive) {
            this.setState({ loading: true });
            fetchAddress(location).then(
              ({ countryAlpha2Code }) => {
                const userCountry = COUNTRY_LIST.find(c => c.code === countryAlpha2Code);
                if (userCountry) {
                  updateProfile({ country: userCountry.code }).then(() => {
                    this.setState({ loading: false });
                    tabsGo(userProfile);
                  });
                } else {
                  this.setState({ loading: false });
                  tabsGo(userProfile);
                }
              },
              () => {
                tabsGo(userProfile);
              },
            );
          } else {
            tabsGo(userProfile);
          }
        },
        () => {},
      );
    } else {
      tabsGo(profile);
    }
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
    this.props.googleLogin().then(
      () => {
        this.gotoTabs();
      },
      () => {},
    );
  };
  handleSkipPress = () => {
    this.props.navigation.navigate('PublicHome');
  };

  handleLinkPress = link => () =>
    this.props.navigation.navigate('PrivacyAndTerms', {
      uri: link,
    });

  render() {
    const { t, isProfileLoading } = this.props;
    const { loading } = this.state;
    if (isProfileLoading || loading) {
      return (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <ImageBackground
        resizeMode="stretch"
        style={styles.image}
        source={require('./images/background.png')}
      >
        <StatusBar translucent barStyle="light-content" />

        <Logo style={styles.logo} />
        <Text style={styles.heading}>
          {t('label_text_app_subtitle')}
        </Text>
        <View style={styles.buttonContainer}>
          <SocialButton
            style={styles.button}
            text={t('label_button_facebook')}
            icon="facebook"
            color={styles.$fbButtonColor}
            onPress={this.handleFBPress}
          />
          <View style={styles.buttonSeparator} />
          <SocialButton
            style={styles.button}
            text={t('label_button_google')}
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
            {t('label_button_try_app')}
          </Text>
        </TouchableOpacity>
        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={this.handleLinkPress(TERMS_URL)}>
            <Text style={styles.skipLogout}>
              {t('label_header_tc')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleLinkPress(PRIVACY_URL)}>
            <Text style={styles.skipLogout}>
              {t('label_privacy_policy_header')}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const mapState = state => {
  return {
    agreedToTerms: userSelectors.didAgreeToTerms(state),
    isAuthenticated: userSelectors.isAuthenticated(state),
    token: userSelectors.getToken(state),
    isProfileLoading: userSelectors.isProfileLoading(state),
    profile: userSelectors.getProfile(state),
    profileError: userSelectors.getProfileError(state),
    locationActive:
      locSels.hasLocationActive(state) && locSels.wasUserLocationSet(state),
    location: locSels.userLocationSelector(state),
  };
};

const mapDispatch = {
  facebookLogin: userOperations.facebookLogin,
  googleLogin: userOperations.googleLogin,
  getProfile: userOperations.getProfile,
  updateProfile: userOperations.updateProfile,
  fetchTeams: teamsOperations.fetchTeams,
};

export default compose(
  connect(mapState, mapDispatch),
  withNavigationHelpers(),
  translate(),
  // withLoadingScreen(() => true),
)(Login);
