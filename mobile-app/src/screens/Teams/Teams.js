import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator
} from 'react-native';
import styles from './styles';
import strings from '../../assets/strings';
import { ButtonDelete } from '../../assets/images';
import { COUNTRIES_HASH } from '../../shared/countries';

export default class Teams extends Component {

  state = { search: '' };

  handleSearchChange = (search) => {
    const { onFetchTeams } = this.props;
    this.setState({ search }, () => {
      if (this.state.search === '') {
        onFetchTeams();
      }
      if (this.state.search.length > 3) {
        onFetchTeams(this.state.search);
      }
    });
  };

  clearSearch = () => {
    const { onFetchTeams } = this.props;
    this.setState({ search: '' }, () => onFetchTeams());
  };

  keyExtractor = item => item.id;

  renderTeamsListItem = ({ item }) => (
    <TouchableOpacity
      style={styles.teamsListItem}
      onPress={() => this.props.navigator.push({
        screen: 'TEAM_SCREEN',
        passProps: { teamId: item.id },
        title: 'Team',
      })}>
      <Image source={{ uri: item.image }} style={styles.teamLogo} />
      <View>
        <Text style={styles.upperText}>{item.name}</Text>
        <Text style={styles.lowerText}>{item.CC ? COUNTRIES_HASH[item.CC] : "Global"}</Text>
      </View>
    </TouchableOpacity>
  );

  renderSeparator = () => {
    return (
      <View style={styles.listDivider} />
    );
  };

  renderTeamsList = (teams) => (
    <FlatList
      data={teams}
      renderItem={this.renderTeamsListItem}
      keyExtractor={this.keyExtractor}
      ItemSeparatorComponent={this.renderSeparator}
    />
  );

  renderSearchField = () => (
    <View style={[styles.horizontal, styles.searchContainerStyle]}>
      <TextInput
        placeholderTextColor={'rgb(41, 127, 202)'}
        value={this.state.search}
        style={styles.searchField}
        ref="input"
        onChangeText={this.handleSearchChange}
        placeholder={strings.label_text_select_country_hint}
        underlineColorAndroid={'transparent'}
      />
      {this.state.search !== '' && <TouchableOpacity onPress={this.clearSearch}>
        <Image source={ButtonDelete} style={styles.deleteButton} />
      </TouchableOpacity>}
    </View>
  );

  renderNoTeams = () => (
    <View>
      <Text style={styles.upperText}>Your search was so unique,</Text>
      <Text style={styles.lowerText}>we couldn't find the match.</Text>
    </View>
  );

  spinner = () => {
    return (
      <ActivityIndicator
        style={styles.spinner}
        size="large"
        color="rgb(0, 143, 223)"
      />
    );
  };

  componentDidMount() {
    const { onFetchTeams } = this.props;
    onFetchTeams();
  }

  render() {
    const { teams, loading } = this.props;
    console.log('PROPS', this.props);
    return (
      <View style={styles.container}>
        {this.renderSearchField()}
        {loading
          ? this.spinner()
          : teams && teams.length > 0
            ? this.renderTeamsList(teams)
            : this.renderNoTeams()
        }
      </View>
    );
  }
}