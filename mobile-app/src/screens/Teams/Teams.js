import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Divider } from '../../components/Divider';
import { SimpleButton } from '../../components/Buttons';
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

  handleTeamChange = (team) => {
    console.log(e);
    this.props.updateProfile({ team: team.id });
  };

  render() {
    const team  = this.props.team;
    const teams = !team ? this.props.teams :
      this.props.teams.filter(function(obj) {
        return obj.id !== team.id;
      });
    return (
      <View style={styles.container}>
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
                  <SimpleButton
                    style={styles.teamJoinButton}
                    onPress={() => this.handleTeamChange(teamsItem)}
                    text="Join"
                  />
                </View>
              </View>
              <Divider />
            </View>
          );
        })}
      </View>
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
  updateProfile: userOps.updateProfile,
};

export default compose(
  connect(mapState, mapDispatch),
  withNavigationHelpers(),
  translate(),
)(Teams);
