import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Divider } from '../../components/Divider';
import { BlueButton } from '../../components/Buttons';
import { withNavigationHelpers } from '../../services/Navigation';

import {
  operations as userOps,
  selectors as userSels,
} from '../../reducers/user';

import {
  operations as teamsOps,
  selectors as teamsSels,
} from '../../reducers/teams';

import styles from './styles';

class Teams extends Component {
  constructor(props) {
    super(props);
    this.handleTeamChange = this.handleTeamChange.bind(this);
  }

  handleTeamChange(team) {
    console.log('Join to team: ', team);
    this.props.updateTeam({ team: team.id });
  }

  render() {
    const { t, team } = this.props;
    const teams = !team ? this.props.teams :
      this.props.teams.filter(function(obj) {
        return obj.id !== team.id;
      });
    const handleTeamChange = this.handleTeamChange;
    return (
      <ScrollView style={styles.container}>
        {teams.map(function(teamsItem, key){
          return (
            <View>
              <View style={styles.teamContainer} key={key}>
                <View style={styles.nameContainer}>
                  <Text style={styles.teamTitle}>
                    {teamsItem.name}
                  </Text>
                  <Text style={styles.teamText}>
                    {teamsItem.description && teamsItem.description}
                  </Text>
                </View>
                <View style={styles.actionContainer}>
                  <BlueButton
                    text="Join"//{t('label_button_join')}
                    onPress={() => handleTeamChange(teamsItem)}
                    disabled={team.id === teamsItem.id}
                  />
                </View>
              </View>
              <Divider />
            </View>
          );
        })}
      </ScrollView>
    );
  }
}
const mapState = (state) => {
  return {
    team: userSels.getProfileTeam(state),
    teams: teamsSels.teamsSelector(state),
  };
};
const mapDispatch = {
  updateTeam: teamsOps.updateTeam,
};

export default compose(
  connect(mapState, mapDispatch),
  withNavigationHelpers(),
  translate(),
)(Teams);
