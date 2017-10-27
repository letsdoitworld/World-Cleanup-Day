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
  };
  handleTeamPress = () => {
    this.props.navigation.navigate('Teams');
  };
  renderProfilePicture = (profile) => {
    const img = profile && profile.pictureURL
      ? { uri: profile.pictureURL }
      : require('./images/avatar.png');
    return <Image source={img} style={styles.usernameImage} />;
  };
  render() {
    const { t, profile, country, team } = this.props;
    //const {}
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
        <View style={styles.listContainer}>
          <List containerStyle={[styles.separator, styles.list]}>
            <ListItem
              {...listItemProps}
              title={team ? t('label_text_your_team') : t('label_text_join_to_team')}
              subtitle={team ? team.name : t('label_text_join_to_team_description')}
              avatar={require('./images/img_increaseimpact_jointeam.png')}
              onPress={this.handleTeamPress}
              subtitleNumberOfLines={2}
            />
          </List>
        </View>
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
