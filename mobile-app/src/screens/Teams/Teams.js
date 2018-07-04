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
import { Backgrounds } from '../../assets/images';
import { TEAM_SCREEN } from '../index';
import { Button } from '../../components/Button';

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
        screen: TEAM_SCREEN,
        passProps: { teamId: item.id },
        title: strings.label_text_team,
      })}>
      <Image source={{ uri: item.image }} style={styles.teamLogo} />
      <View>
        <Text style={styles.upperText}>{item.name}</Text>
        <Text style={styles.lowerText}>{item.CC ? COUNTRIES_HASH[item.CC] : strings.label_text_global_team}</Text>
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
      {this.state.search !== '' &&
      <TouchableOpacity
        style={styles.deleteButtonWrapper}
        onPress={this.clearSearch}
      >
        <Image source={ButtonDelete} style={styles.deleteButton} />
      </TouchableOpacity>}
    </View>
  );

  renderNoTeams = () => (
    <View style={styles.noTeams}>
      <Image source={Backgrounds.EmptyTeams} />
      <Text style={[styles.upperText, {marginTop: 30}]}>{strings.label_text_noteams_top}</Text>
      <Text style={styles.lowerText}>{strings.label_text_noteams_bottom}</Text>
    </View>
  );

  renderGuestTeams = () => {
    return (
      <View style={styles.guestContainer}>
        <View style={styles.imgPlaceholder} />
        <Button
          onPress={this.props.onGuestLogIn}
          text="Log In"
        />
      </View>
    )
  }

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
    const { onFetchTeams, isAuthenticated, isGuestSession } = this.props;
    if (isAuthenticated && !isGuestSession) {
      onFetchTeams();
    }
  }

  render() {
    const { teams, loading, isAuthenticated, isGuestSession } = this.props;
    if (!isAuthenticated && isGuestSession) return this.renderGuestTeams();
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