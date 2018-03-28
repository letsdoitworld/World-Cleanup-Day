import React, { Component } from 'react';
import { View, Image, Text, ActivityIndicator } from 'react-native';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { Divider } from '../../components/Divider';
import { selectors as userSelectors } from '../../reducers/user';
import { selectors as appSelectors } from '../../reducers/app';
import { withNavigationHelpers } from '../../services/Navigation';
import styles from './styles';


class Profile extends Component {
  displayLoading = () => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  };
  renderProfilePicture = (profile) => {
    const img = profile && profile.pictureURL
      ? { uri: profile.pictureURL }
      : require('./avatar.png');
    return <Image source={img} style={styles.usernameImage} />;
  };
  render() {
    const { profile, country, isConnected } = this.props;
    if(!isConnected) {
      return this.displayLoading();
    }
    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <View style={styles.pictureContainer}>
            {this.renderProfilePicture(profile)}
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.username}>
              {profile && profile.name}
            </Text>
            {country &&
              <View style={styles.locationContainer}>

                <Image
                  source={require('../../assets/images/icon_location.png')}
                />
                <Text style={styles.countryText}>
                  {country.name}
                </Text>
              </View>}

          </View>
        </View>
        <Divider />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profile: userSelectors.getProfile(state),
    country: userSelectors.getProfileCountry(state),
    isConnected: appSelectors.isConnected(state),
  };
};

const mapDispatchToProps = {};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withNavigationHelpers(),
)(Profile);
