import React, { Component } from 'react';
import { View, Image, Text, ActivityIndicator } from 'react-native';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Divider } from '../../components/Divider';
import { selectors as userSelectors } from '../../reducers/user';
import { operations as teamsOps } from '../../reducers/teams';
import { operations as userOps } from '../../reducers/user';
import { selectors as appSelectors } from '../../reducers/app';
import { withNavigationHelpers } from '../../services/Navigation';
import styles from './styles';
import { COUNTRIES_HASH } from '../../shared/countries';
import SelectBlock from './SelectBlock';

class Profile extends Component {

  componentWillMount() {
    this.props.getProfile();
  }

  handleTeamPress = team => {
    this.props.navigation.navigate('TeamProfile', { team });
  };

  handleJoinTeamPress = () => {
    this.props.navigation.navigate('Teams');
  };


  displayLoading = () => {
    return (
      <View style={styles.displayLoadingView}>
  <ActivityIndicator />
    </View>
  );
  };

  renderProfilePicture = (profile) => {
    const img = profile && profile.pictureURL
      ? { uri: profile.pictureURL }
      : require('./avatar.png');
    return <Image source={img} style={styles.usernameImage}/>;
  };

  render() {
    const { t, profile, country, team, isConnected } = this.props;
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
            </View>
            }
          </View>
        </View>
        <Divider/>
        <View style={styles.addInfoContainer}>
          {team &&
          <View>
            <View style={styles.teamsContainer}>
              <Text style={styles.teamsHeader}>My team</Text>
              {SelectBlock({
                header: team.name,
                description: team.CC ? COUNTRIES_HASH[team.CC] : this.props.t('label_text_global_team'),
                onPress: () => this.handleTeamPress(team),
                imageURL: team.image,
                imageLocal: require('./team.png'),
              })}
            </View>
            <Divider/>
          </View>}
          <View style={styles.teamsContainer}>
            <Text style={styles.teamsHeader}>How to increase your impact</Text>
            {SelectBlock({
              header: team ? t('label_text_search_teams') : t('label_text_join_a_team'),
              description: t('label_text_join_a_team_description'),
              onPress: this.handleJoinTeamPress,
              imageLocal: require('./team.png')
            })}
          </View>

        </View>
      </View>
    )
      ;
  }
}

const mapStateToProps = (state) => {
  return {
    profile: userSelectors.getProfile(state),
    country: userSelectors.getProfileCountry(state),
    team: userSelectors.getProfileTeam(state),
    isConnected: appSelectors.isConnected(state),
  };
};
const mapDispatchToProps = {
  updateTeam: teamsOps.updateTeam,
  getProfile: userOps.getProfile,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withNavigationHelpers(),
  translate(),
)(Profile);
