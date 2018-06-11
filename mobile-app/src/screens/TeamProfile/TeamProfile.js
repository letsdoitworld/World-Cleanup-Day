import React, { Component } from 'react';
import { View, Image, Text, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import _ from 'lodash';

import { Divider } from '../../components/Divider';
import { selectors as userSelectors } from '../../reducers/user';
import { selectors as teamSelectors } from '../../reducers/teams';
import { operations as teamsOps } from '../../reducers/teams';
import { withNavigationHelpers } from '../../services/Navigation';
import { COUNTRIES_HASH } from '../../shared/countries';
import { Button } from '../../components/Buttons';
import TrashCircle from './TrashCircle';
import ActivityListItem from '../MyActivity/components/ActivityListItem';
import { LAST_ACTIVITY_TRASHPOINTS_AMOUNT } from '../../shared/constants';

import styles from './styles';

class TeamProfile extends Component {


  constructor(props) {
    super(props);
    const { params } = props.navigation.state;
    this.state = params;
  }

  alert = (join, onPress, team) => {
    const { t } = this.props;
    Alert.alert(
      join ? t('label_button_join_team') : t('label_button_leave_team'),
      `${join ? t('label_text_select_join') : t('label_text_select_leave')} ${team.name}?`,
      [
        { text: t('label_no'), style: t('label_cancel') },
        { text: t('label_yes'), onPress },
      ],
    );
  };

  handleJoinTeamPress = team => this.alert(true, () => this.joinTeam(team.id), team);

  joinTeam = (id) => {
    this.props.updateTeam({ team: id });
    this.props.navigation.navigate('Profile');
  };

  goToDetails = _.debounce(
    ({ id, location }) => {
      this.props.navigation.navigate('Details', {
        markerId: id,
        latlng: location,
      });
    },
    1000,
    {
      leading: true,
      trailing: false,
    },
  );

  handleTeamLeavePress = (team) => this.alert(false, this.leaveTeam, team);

  leaveTeam = () => {
    this.props.updateTeam({ team: '' });
    this.props.navigation.navigate('Profile');
  };

  componentWillMount() {
    this.props.fetchTeam(this.state.team.id);
  }

  render() {
    const { team, loading } = this.props;
    const myTeam = this.props.myTeam;
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator/>
        </View>
      )
    }
    return (
      <ScrollView>
        <View style={styles.container}>
          <View>
            <View style={styles.infoContainer}>
              <View style={styles.pictureContainer}>
                <Image source={{ uri: team.image }}
                       style={styles.usernameImage}/>
              </View>
              <View style={styles.nameContainer}>
                <Text style={styles.username}>
                  {team.name}
                </Text>
                <View style={styles.locationContainer}>
                  <Image
                    source={require('../../assets/images/icon_location.png')}
                  />
                  <Text style={styles.countryText}>
                    {team.CC ? COUNTRIES_HASH[team.CC] : this.props.t('label_text_global_team')}
                  </Text>
                </View>
                <View style={styles.locationContainer}>
                  <Image
                    source={require('../../assets/images/ic_organization.png')}
                  />
                  <Text style={styles.countryText}>
                    {team.members} {this.props.t('label_text_members')}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.descriptionContainer}>
              <Divider/>
              <Text
                style={styles.descriptionText}> {team.teamDescription} </Text>
            </View>
            <Divider/>
            <View style={styles.trashPointsContainer}>
              <Text
                style={styles.trashPointsText}>{this.props.t('label_text_team_trash_points')}: {team.trashpoints}
              </Text>
              {team.groupCount && <View style={styles.circlesContainer}>
                <TrashCircle count={team.groupCount.threat}
                             status={'threat'}/>
                <TrashCircle count={team.groupCount.regular}
                             status={'regular'}/>
                <TrashCircle count={team.groupCount.cleaned}
                             status={'cleaned'}/>
                <TrashCircle count={team.groupCount.outdated}
                             status={'outdated'}/>
              </View>}
            </View>
            <Divider/>
            <View style={styles.trashPointsContainer}>
              <Text
                style={styles.trashPointsText}>{this.props.t('label_text_latest_activity')}
              </Text>
              {team.lastTrashpoints && team.lastTrashpoints.slice(0, LAST_ACTIVITY_TRASHPOINTS_AMOUNT).map(trash => (
                <ActivityListItem key={trash.id} {...trash}
                                  onPressItem={this.goToDetails}
                                  backgroundColor={'transparent'}/>
              ))}
            </View>
          </View>
          {(myTeam && myTeam.id === team.id || !myTeam) && <View>
            <Divider/>
            <View style={styles.bottomContainer}>
              <Button
                style={styles.createButton}
                text={myTeam ? this.props.t('label_button_leave_team') : this.props.t('label_button_join_team')}
                onPress={() => myTeam ? this.handleTeamLeavePress(team) : this.handleJoinTeamPress(team)}
              />
            </View>
          </View>}
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    myTeam: userSelectors.getProfileTeam(state),
    team: teamSelectors.teamSelector(state),
    loading: teamSelectors.loadingSelector(state),
  };
};
const mapDispatchToProps = {
  updateTeam: teamsOps.updateTeam,
  fetchTeam: teamsOps.fetchTeam,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withNavigationHelpers(),
  translate(),
)(TeamProfile);
