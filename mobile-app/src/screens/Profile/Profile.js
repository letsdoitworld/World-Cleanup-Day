import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { Divider } from '../../components/Divider';
import { selectors as userSelectors } from '../../reducers/user';
import { withNavigationHelpers } from '../../services/Navigation';
import styles from './styles';

class Profile extends Component {
  renderProfilePicture = (profile) => {
    const img = profile && profile.pictureURL
      ? { uri: profile.pictureURL }
      : require('./avatar.png');
    return <Image source={img} style={styles.usernameImage} />;
  };
  render() {
    const { profile, country } = this.props;
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
  };
};

const mapDispatchToProps = {};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withNavigationHelpers(),
)(Profile);
