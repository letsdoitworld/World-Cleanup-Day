import React, { Component } from 'react';
import { View, Image, Text, TouchableHighlight } from 'react-native';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Divider } from '../../components/Divider';
import { selectors as userSelectors } from '../../reducers/user';
import { operations as teamsOps } from '../../reducers/teams';
import { withNavigationHelpers } from '../../services/Navigation';

import styles from './styles';

class Profile extends Component {
  handleJoinTeamPress = () => {
    this.props.navigation.navigate('Teams');
  };
  handleLeaveTeamPress = (team) => {
    this.props.updateTeam({ team: '' });
  };
  handleTeamPress = () => {
    this.props.navigation.navigate('Teams');
  };
  renderProfilePicture = (profile) => {
    const img = profile && profile.pictureURL
      ? { uri: profile.pictureURL }
      : require('./avatar.png');
    return <Image source={img} style={styles.usernameImage} />;
  };
  render() {
    const { t, profile, country, team } = this.props;
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
        <TouchableHighlight onPress={this.handleTeamPress} activeOpacity={0.7} underlayColor="transparent">
          <View style={styles.teamContainer}>
            <View style={styles.teamIconContainer}>
              <Image source={require('./team.png')} style={styles.teamIconImage} />
            </View>
            <View style={styles.teamContentContainer}>
              <View style={styles.teamTitleContainer}>
                <Text style={styles.teamTitle}>
                  {team ? t('label_text_your_team') : t('label_text_join_to_team')}
                </Text>
              </View>
              <View style={styles.teamNameContainer}>
                <Text style={styles.teamName}>
                  {team ? team.name : t('label_text_join_to_team_description')}
                </Text>
              </View>
            </View>
            <View style={styles.teamChevronContainer}>
              <Image
                style={styles.teamChevron}
                source={require('../../assets/images/icon_menu_arrowforward.png')}
              />
            </View>
          </View>
        </TouchableHighlight>
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
const mapDispatchToProps = {
  updateTeam: teamsOps.updateTeam,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withNavigationHelpers(),
  translate(),
)(Profile);
