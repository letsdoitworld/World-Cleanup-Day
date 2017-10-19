import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { Divider } from '../../components/Divider';
import { SimpleButton } from '../../components/Buttons';
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
    const { profile, country, team } = this.props;
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
              </View>
            }
          </View>
        </View>
        <Divider />
        {team &&
          <View>
            <View style={styles.teamContainer}>
              <Text style={styles.teamTitle}>
                My Team
              </Text>
              <View style={styles.teamNameContainer}>
                <Text style={styles.teamText}>
                  {team.name}
                </Text>
                <SimpleButton
                  style={styles.teamLeaveButton}
                  text="Leave"
                />
              </View>
            </View>
            <Divider />
          </View>
        }
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profile: userSelectors.getProfile(state),
    country: userSelectors.getProfileCountry(state),
    team: userSelectors.getProfileTeam(state),
  };
};

const mapDispatchToProps = {};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withNavigationHelpers(),
)(Profile);
