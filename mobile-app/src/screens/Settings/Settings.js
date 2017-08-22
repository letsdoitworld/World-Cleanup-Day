import React, { Component } from 'react';
import { View } from 'react-native';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import _ from 'lodash';

import { List, ListItem } from 'react-native-elements';
import { withNavigationHelpers } from '../../services/Navigation';
import { CountryModal } from './components/CountryModal';

import {
  operations as userOps,
  selectors as userSels,
} from '../../reducers/user';
import { COUNTRY_LIST } from '../../shared/constants';

import styles, {
  listItemProps,
  downRightIcon,
  defaultRightIcon,
} from './styles';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    const { countryFilter } = this.state;
    if (!countryFilter) {
      return COUNTRY_LIST;
    }
    return COUNTRY_LIST.filter(
      c => c.name.toLowerCase().indexOf(countryFilter.toLowerCase()) !== -1,
    );
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
    const { logout, navigation } = this.props;
    logout().then(() => {
      navigation.resetTo('Login');
    }, () => null);
  };

  handleTermsPress = () => {
    this.props.navigation.navigate('Terms');
  };
  handlePrivacyPress = () => {
    this.props.navigation.navigate('Privacy');
  };
  handleAboutPress = () => {
    this.props.navigation.navigate('About');
  };

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

  render() {
    const { country } = this.props;
    const countrySubtitle = country
      ? country.name
      : this.props.t('label_country_picker_placeholder');
    return (
      <View>
        <View style={styles.listContainer}>
          <List containerStyle={[styles.separator, styles.list]}>
            <ListItem
              {...listItemProps}
              title="Country"
              subtitle={countrySubtitle}
              onPress={this.handleCountryItemPress}
            />
          </List>
          <List containerStyle={[styles.separator, styles.list]}>
            <ListItem
              {...listItemProps}
              subtitleStyle={[styles.subtitle]}
              onPress={this.handleTermsPress}
              subtitle="Terms and Conditions"
            />
            <ListItem
              {...listItemProps}
              subtitleStyle={[styles.subtitle]}
              onPress={this.handlePrivacyPress}
              subtitle="Privacy Policy"
            />
          </List>
          <List containerStyle={[styles.separator, styles.list]}>
            <ListItem
            {...listItemProps}
              subtitleStyle={[styles.subtitle]}
              onPress={this.handleAboutPress}
              subtitle="About"
            />
          </List>
          <List containerStyle={[styles.separator, styles.list]}>
            <ListItem
              subtitleStyle={[styles.subtitle, styles.logout]}
              onPress={this.handleLogoutPress}
              subtitle="Log out"
              hideChevron
            />
          </List>

          {this.renderModals()}

        </View>
      </View>
    );
  }
}
const mapState = (state) => {
  return {
    profile: userSels.getProfile(state),
    country: userSels.getProfileCountry(state),
    isProfileUpdating: userSels.isProfileUpdating(state),
  };
};
const mapDispatch = {
  logout: userOps.logout,
  updateProfile: userOps.updateProfile,
};

export default compose(
  connect(mapState, mapDispatch),
  withNavigationHelpers(),
  translate(),
)(Settings);
