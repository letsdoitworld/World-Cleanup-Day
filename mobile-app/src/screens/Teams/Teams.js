import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  TextInput
} from 'react-native';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';


import { withNavigationHelpers } from '../../services/Navigation';
import { operations as teamsOperations } from '../../reducers/teams';
import Team from './Team';
import SearchBar from './SearchBar';

const LENGTH_SEARCH_START = 2;

import {
  selectors as userSels,
} from '../../reducers/user';

import {
  selectors as teamsSels,
} from '../../reducers/teams';

import styles from './styles';

class Teams extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: undefined,
      teams: []
    };
  }

  componentWillMount() {
    this.props.clearTeams();
  }

  getFilteredTeams = async () => {
    const { search } = this.state;
    const { fetchTeams } = this.props;

    if (search && search.length > LENGTH_SEARCH_START) {
      const teams = await fetchTeams(search);
      this.setState({ teams });
    }
  };

  handleSearchChanged = (search) => {
    this.setState({ search });
  };

  handleTeamPress = team => {
    this.props.navigation.navigate('TeamProfile', { team });
  };

  render() {
    const { t, teams, loading } = this.props;
    const { search } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <SearchBar onChangeText={this.handleSearchChanged}
                   value={search}
                   placeholder={t('label_text_search_placeholder')}
                   onPress={this.getFilteredTeams}/>
        <View style={styles.container}>
          {loading
            ? <View style={styles.loadingContainer}>
              <ActivityIndicator/>
            </View>
            : <View style={styles.container}>
              {(teams && teams.length > 0) ?
                <ScrollView>
                  {teams.map(team =>
                    <Team
                      global={t('label_text_global_team')}
                      team={team}
                      openTeam={(id) => this.handleTeamPress(id)}/>)
                  }
                </ScrollView> :
                <View style={styles.defaultContainer}>
                  <Text
                    style={styles.defaultTextHeader}>{t('label_text_search_for_a_team')}</Text>
                  <Text
                    style={styles.defaultTextDescription}>{t('label_text_work_together')}</Text>
                </View>}
            </View>
          }
        </View>
      </View>
    );
  }
}

const mapState = (state) => {
  return {
    team: userSels.getProfileTeam(state),
    teams: teamsSels.teamsSelector(state),
    loading: teamsSels.loadingSelector(state),
  };
};
const mapDispatch = {
  fetchTeams: teamsOperations.fetchTeams,
  clearTeams: teamsOperations.clearTeams,
};

export default compose(
  connect(mapState, mapDispatch),
  withNavigationHelpers(),
  translate(),
)(Teams);
