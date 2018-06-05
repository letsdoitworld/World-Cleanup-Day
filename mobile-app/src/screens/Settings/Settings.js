/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  TouchableHighlight,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { PRIVACY_URL, TERMS_URL } from 'react-native-dotenv';
import { Badges } from '../../assets/images';
import { AlertModal } from '../../components/AlertModal';

import { CountryModal } from './components/CountryModal';
import strings from '../../assets/strings';
import Switch from '../../components/iosLikeSwitch/IosLikeSwitch';

import styles from './styles';

import { ABOUT_SCREEN } from '../index';


export class Settings extends Component {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarTitleTextCentered: true,
    statusBarColor: 'transparent',
    statusBarTextColorScheme: 'dark',
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.isPrivateProfile,
      showCountryModal: false,
      countryFilter: undefined,
      showLogoutDialog: false,
    };
    this.handleCountryItemPress = _.debounce(
      this.handleCountryItemPress,
      2000,
      {
        trailing: false,
        leading: true,
      },
    );
  }

  getFilteredCountries() {
    // const { countryFilter } = this.state;
    // if (!countryFilter) {
    //   return COUNTRY_LIST;
    // }
    // return COUNTRY_LIST.filter(
    //   c => c.name.toLowerCase().indexOf(countryFilter.toLowerCase()) !== -1,
    // );
  }
  openLogout = () => {
    this.setState({ showLogoutDialog: true });
  }
  closeLogout = () => {
    this.setState({ showLogoutDialog: false });
  }
  logout = () => {
    this.closeLogout();
    return this.props.onLogout();
  }
  cancelButton = {
    text: strings.label_button_cancel,
    onPress: this.closeLogout,
  };
  logoutButton = {
    text: strings.label_button_logout,
    onPress: this.logout,
  };
  closeModal = () => {
    this.setState({
      showCountryModal: false,
    });
  };

  handleCountryItemPress = () => {
    this.setState(prevState => ({
      showCountryModal: !prevState.showCountryModal,
    }));
  };

  handleCountryChanged = (country) => {
    this.setState({
      showCountryModal: false,
      countryFilter: undefined,
    });
    this.props.updateProfile({ country: country.code });
  };
  handleCountryFilterChanged = (countryFilter) => {
    this.setState({ countryFilter });
  };

  handleAboutPress = () => {
    this.props.navigator.push({
      screen: ABOUT_SCREEN,
      title: strings.label_about_header,
    });
  };

  handlePrivacyPress = (status) => {
    if (_.isEmpty(this.props.myEvents) || this.props.myEvents === null) {
      this.props.onUpdateProfileStatus(status);
      this.setState({ value: !this.state.value });
    } else {
      Alert.alert(strings.label_private_profile_wor_title,
        'You are an event creator! You can’t make your profile private ' +
          'while you have events connected to your profile.',
        [
          { text: strings.label_button_cancel,
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel' },
        ],
        { cancelable: false },
      );
    }
  };

  handleLinkPress = link => () =>
    Linking.openURL(link).catch(err => console.error('An error occurred', err));

  renderModals = () => {
    const { showCountryModal, countryFilter } = this.state;
    return (
      <View>
        <CountryModal
          visible={showCountryModal}
          onPress={this.handleCountryChanged}
          countries={this.getFilteredCountries()}
          onSearchChange={this.handleCountryFilterChanged}
          search={countryFilter}
          onClose={this.closeModal}
        />
      </View>
    );
  };

  renderLocation() {
    const { profile } = this.props;
    if (profile && profile.location) {
      return (<View style={styles.itemStyle}>
        <Image
          style={styles.imageItemStyle}
          source={require('../../../src/assets/images/ic_location.png')}
        />
        <Text style={styles.textItemStyle}>{profile.location}</Text>
      </View>);
    }
    return null;
  }

  renderPhoneNumber() {
    const { profile } = this.props;
    if (profile && profile.phoneNumber) {
      return (<View style={styles.itemStyle}>
        <Image
          style={styles.imageItemStyle}
          source={require('../../assets/images/ic_phone_number.png')}
        />
        <Text style={styles.textItemStyle}>{profile.phoneNumber}</Text>
      </View>);
    }
    return null;
  }

  renderEmail() {
    const { profile } = this.props;
    if (profile && profile.email) {
      return (
        <View style={styles.itemStyle}>
          <Image
            style={styles.imageItemStyle}
            source={require('../../assets/images/ic_email.png')}
          />
          <Text style={styles.textItemStyle}>{profile.email}</Text>
        </View>
      );
    }
    return null;
  }

  render() {
    const { profile } = this.props;
    // if (profile === null) {
    //     return null
    // }
    // const countrySubtitle = country
    //   ? country.name
    //   : this.props.t('label_country_picker_placeholder');
    return (
      <View>
        <AlertModal
          visible={this.state.showLogoutDialog}
          title={strings.label_title_logout}
          subtitle={strings.label_subtitle_logout}
          text={strings.label_text_logout}
          image={Badges.logout}
          buttons={[this.cancelButton, this.logoutButton]}
          onOverlayPress={this.closeLogout}
          onPress={this.closeLogout}
        />
        <View style={styles.listContainer}>
          <View style={styles.titleStyle}>
            <Text style={styles.titleTextStyle}>
              {strings.label_profile_settings.toUpperCase()}
            </Text>
          </View>
          <View style={styles.itemStyle}>
            <Image
              style={styles.imageItemStyle}

              source={require('./images/ic_name.png')}
            />
            <Text style={styles.textItemStyle}>{profile && profile.name}</Text>
          </View>
          {this.renderLocation()}
          {this.renderPhoneNumber()}
          {this.renderEmail()}
          <View style={styles.titleStyle}>
            <Text style={styles.titleTextStyle}>
              {strings.label_privacy_settings.toUpperCase()}
            </Text>
          </View>
          <View style={styles.itemStyle}>
            <Text style={styles.textItemStyle}>{strings.label_private_profile}</Text>
            <View style={styles.switchStyle}>
              <Switch
                width={50}
                height={30}
                value={this.state.value}
                onSyncPress={() => this.handlePrivacyPress(this.state.value)}
              />
            </View>
          </View>
          <View style={styles.titleStyle}>
            <Text style={styles.titleTextStyle}>
              {strings.label_general_information.toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.itemStyle}
            onPress={this.handleLinkPress(TERMS_URL)}
          >
            <Text style={styles.textItemStyle}>{strings.label_header_tc}</Text>
            <Image
              style={styles.arrowItemStyle}
              source={require('../../assets/images/icon_menu_arrowforward.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemStyle}
            onPress={this.handleLinkPress(PRIVACY_URL)}
          >
            <Text style={styles.textItemStyle}>
              {strings.label_privacy_policy_header}
            </Text>
            <Image
              style={styles.arrowItemStyle}
              source={require('../../assets/images/icon_menu_arrowforward.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemStyle}
            onPress={this.handleAboutPress}
          >
            <Text style={styles.textItemStyle}>
              {strings.label_about_world_cleanup_day}
            </Text>
            <Image
              style={styles.arrowItemStyle}
              source={require('../../assets/images/icon_menu_arrowforward.png')}
            />
          </TouchableOpacity>
          <TouchableHighlight
            style={styles.logoutButtonStyle}
            onPress={this.openLogout}
          >
            <Text style={styles.logOutTextStyle}>{strings.label_button_logout}</Text>
          </TouchableHighlight>

          {/* {this.renderModals()} */}

        </View>
      </View>
    );
  }
}

Settings.propTypes = {
  onUpdateProfileStatus: PropTypes.func,
  onLogout: PropTypes.func,
  profile: PropTypes.object,
  myEvents: PropTypes.array,
};

export default Settings;
