import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Item } from './components/Item';
import { withNavigationHelpers } from '../../services/Navigation';
import { selectors as appSelectors } from '../../reducers/app';
import { DropDownListModal } from '../../components/DropDownListModal';
import {
  actions as userActions,
  selectors as userSelectors,
} from '../../reducers/user';
import { selectors as trashpileSelectors } from '../../reducers/trashpile';

class Settings extends Component {
  static propTypes = {
    showCountryDropDownList: PropTypes.bool,
    country: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      showCountryDropDownList: false,
      country: props.country,
    };
  }

  handleCountryItemPress = () => {
    this.setState({
      showCountryDropDownList: !this.state.showCountryDropDownList,
    });
  };

  handleCountryValueChange = countryCode => {
    const country = this.props.countries.find(
      ({code}) => code === countryCode,
    );
    if (country) {
      this.props.setProfileCountry(country.name);
    }
    this.setState({
      showCountryDropDownList: false,
      country: _.has(country, 'name') ? country.name : '',
    });
  };

  render() {
    const {country, showCountryDropDownList} = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Item
          title="Country"
          optionSelected={country}
          imageStyles={{ width: 10, height: 6 }}
          onPress={this.handleCountryItemPress}
        />

        <DropDownListModal
          items={this.props.countries}
          onPressItem={this.handleCountryValueChange}
          show={showCountryDropDownList}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ app, user, trashpile }) => {
  return {
    countries: appSelectors.getCountries(app),
    country:
      userSelectors.getProfileCountry(user) ||
        trashpileSelectors.getCountry(trashpile),
  };
};

const mapDispatchToProps = {
  setProfileCountry: userActions.setProfileCountry,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withNavigationHelpers(),
)(Settings);
