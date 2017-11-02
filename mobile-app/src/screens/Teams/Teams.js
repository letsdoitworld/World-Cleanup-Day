import React, { Component } from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { FormInput } from 'react-native-elements';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Divider } from '../../components/Divider';
import { BlueButton, GrayButton } from '../../components/Buttons';
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
    this.handleTeamJoinPress = this.handleTeamJoinPress.bind(this);
    this.handleTeamLeavePress = this.handleTeamLeavePress.bind(this);
    this.handleSearchChanged = this.handleSearchChanged.bind(this);

    this.state = {
      loading: true,
      search: undefined,
    };
  }

  componentDidMount() {
    setTimeout(() => {
        this.setState({ loading: false });
    }, 500);
  }

  getFilteredTeams() {
    const { search } = this.state;
    const { teams } = this.props;
    if (!search) {
      return teams;
    }
    return teams.filter(
      c => c.name.toLowerCase().indexOf(search.toLowerCase()) !== -1,
    );
  }

  handleSearchChanged(search) {
    this.setState({ search });
  }

  handleTeamJoinPress(team) {
    this.props.updateTeam({ team: team.id });
  }

  handleTeamLeavePress(team) {
    this.props.updateTeam({ team: '' });
  }

  render() {
    const { t, team } = this.props;
    const { loading, search } = this.state;
    const handleTeamJoinPress = this.handleTeamJoinPress;
    const handleTeamLeavePress = this.handleTeamLeavePress;
    const handleSearchChanged = this.handleSearchChanged;
    const teams = this.getFilteredTeams();
    return (
      <ScrollView style={styles.container}>
        {loading
          ? <View style={styles.loadingContainer}>
              <ActivityIndicator />
            </View>
          : <View>
              <FormInput
                containerStyle={styles.inputContainer}
                placeholder="Search"
                value={search}
                onChangeText={handleSearchChanged}
              />
              {teams.map(function(teamsItem){
                return (
                <View key={teamsItem.id}>
                  <View style={styles.teamContainer}>
                    <View style={styles.nameContainer}>
                      <Text style={styles.teamTitle}>
                        {teamsItem.name}
                      </Text>
                      <Text style={styles.teamText}>
                        {teamsItem.description && teamsItem.description}
                      </Text>
                    </View>
                    <View style={styles.actionContainer}>
                      {(() => {
                          return team && team.id === teamsItem.id ? (
                            <GrayButton
                              text={t('label_button_leave')}
                              onPress={() => handleTeamLeavePress(teamsItem)}
                            />
                          ) : (
                            <BlueButton
                              text={t('label_button_join')}
                              onPress={() => handleTeamJoinPress(teamsItem)}
                            />
                          );
                      })()}
                    </View>
                  </View>
                  <Divider />
                </View>
                );
              })}
            </View>
        }
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
