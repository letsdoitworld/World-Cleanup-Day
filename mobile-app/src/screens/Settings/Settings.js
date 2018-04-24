import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  TouchableHighlight,
  Alert,
  NetInfo,
} from 'react-native';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { CountryModal } from './components/CountryModal';
import strings from '../../config/strings';
import Switch from '../../components/iosLikeSwitch/IosLikeSwitch';

// import {
//   operations as userOps,
//   selectors as userSels,
// } from '../../reducers/user';
import { COUNTRY_LIST } from '../../shared/constants';

import styles, {
    listItemProps,
    downRightIcon,
    defaultRightIcon,
} from './styles';
import { PRIVACY_URL, TERMS_URL } from '../../../env';
import colors from '../../config/colors';
import { ABOUT_SCREEN } from '../index';
import userActions from '../../reducers/user/actions';


export class Settings extends Component {

  static navigatorStyle = {
    tabBarHidden: true,
    navBarTitleTextCentered: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.isPrivateProfile,
      showCountryModal: false,
      countryFilter: undefined,
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

  handleLogoutPress = async () => {

  };

  handleAboutPress = () => {
    this.props.navigator.push({
      screen: ABOUT_SCREEN,
      title: strings.label_about_header,
    });
  };

  handlePrivacyPress = (status) => {
    NetInfo.isConnected.fetch().then((isConnected) => {
      if (!isConnected) {
        Alert.alert(strings.label_private_profile_wor_title,
        'No network connection. Mobile data is disabled. Enable mobile data or connect your phone to Wi-Fi to use the application.',
          [
          { text: strings.label_button_cancel, onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          ],
        { cancelable: false },
        );
      } else if (_.isEmpty(this.props.myEvents) || this.props.myEvents === null) {
        this.props.onUpdateProfileStatus(status);
        this.setState({ value: !this.state.value });
      } else {
        Alert.alert(strings.label_private_profile_wor_title,
          'You are an event creator! You can’t make your profile private while you have events connected to your profile.',
          [
            { text: strings.label_button_cancel, onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          ],
          { cancelable: false },
      );
      }
    });
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
    const { country, profile } = this.props;
        // if (profile === null) {
        //     return null
        // }
        // const countrySubtitle = country
        //   ? country.name
        //   : this.props.t('label_country_picker_placeholder');
    return (
      <View>
        <View style={styles.listContainer}>
          <View style={styles.titleStyle}>
            <Text style={styles.titleTextStyle}>{strings.label_profile_settings.toUpperCase()}</Text>
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
            <Text style={styles.titleTextStyle}>{strings.label_privacy_settings.toUpperCase()}</Text>
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
            <Text style={styles.titleTextStyle}>{strings.label_general_information.toUpperCase()}</Text>
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
            <Text style={styles.textItemStyle}>{strings.label_privacy_policy_header}</Text>
            <Image
              style={styles.arrowItemStyle}
              source={require('../../assets/images/icon_menu_arrowforward.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemStyle}
            onPress={this.handleAboutPress}
          >
            <Text style={styles.textItemStyle}>{strings.label_about_world_cleanup_day}</Text>
            <Image
              style={styles.arrowItemStyle}
              source={require('../../assets/images/icon_menu_arrowforward.png')}
            />
          </TouchableOpacity>
          <TouchableHighlight
            style={styles.logoutButtonStyle}
            onPress={this.props.onLogout}
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
