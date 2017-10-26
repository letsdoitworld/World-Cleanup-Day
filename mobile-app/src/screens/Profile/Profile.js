import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { List, ListItem } from 'react-native-elements';

import { Divider } from '../../components/Divider';
import { GrayButton, BlueButton } from '../../components/Buttons';
import { selectors as userSelectors } from '../../reducers/user';
import { operations as teamsOps } from '../../reducers/teams';
import { withNavigationHelpers } from '../../services/Navigation';

import styles, {
  listItemProps,
  downRightIcon,
  defaultRightIcon,
} from './styles';

class Profile extends Component {
  handleJoinTeamPress = () => {
    this.props.navigation.navigate('Teams');
  };
  handleLeaveTeamPress = (team) => {
      this.props.updateTeam({ team: '' });
  }
  handleTeamPress = () => {
      this.props.navigation.navigate('Teams');
  }
  renderProfilePicture = (profile) => {
    const img = profile && profile.pictureURL
      ? { uri: profile.pictureURL }
      : require('./images/avatar.png');
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
        {team &&
          <View>
            <View style={styles.teamContainer}>
              <Text style={styles.teamTitle}>
                {t('label_text_my_team')}
              </Text>
              <View style={styles.teamNameContainer}>
                <Text style={styles.teamText}>
                  {team.name}
                </Text>
                <GrayButton
                  text={t('label_button_leave')}
                  onPress={this.handleLeaveTeamPress}
                />
              </View>
            </View>
            <Divider />
          </View>
        }
        {!team &&
          <View>
            <View style={styles.teamContainer}>
              <Text style={styles.teamTitle}>
                {t('label_text_join_to_team')}
              </Text>
              <View style={styles.teamNameContainer}>
                <Text style={styles.teamText}>
                  {t('label_text_join_to_team_description')}
                </Text>
                <BlueButton
                  text={t('label_button_join')}
                  onPress={this.handleJoinTeamPress}
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
const mapDispatchToProps = {
  updateTeam: teamsOps.updateTeam,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withNavigationHelpers(),
  translate(),
)(Profile);
