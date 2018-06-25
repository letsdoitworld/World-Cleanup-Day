import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import locationIcon from '../../assets/images/ic_location.png';
import listIcon from '../../assets/images/icons/icList.png';
import trashIcon from '../../assets/images/icons/icTrashpointsInActive.png';
import arrow from '../../assets/images/icon_menu_arrowforward.png';
import styles from './styles';
import strings from '../../assets/strings';
import { TEAM_TRASHPOINTS_SCREEN } from '../index';
import { COUNTRIES_HASH } from '../../shared/countries';

export default class Team extends Component {

  componentDidMount() {
    const { onFetchTeam, teamId } = this.props;
    onFetchTeam(teamId);
  }

  renderButton = (btnText) => (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity
        style={btnText === strings.label_team_leave ? styles.buttonPink : styles.buttonBlue}
        onPress={this.handleBtnClick}
      >
        <Text style={styles.btnText}>{btnText}</Text>
      </TouchableOpacity>
    </View>
  );

  handleBtnClick = () => {
    const { onUpdateProfileTeam, team, myTeam } = this.props;
    const { id } = team;
    id === myTeam ? onUpdateProfileTeam({ team: '' }) : onUpdateProfileTeam({ team: id })
  };

  renderInfo = (icon, title, text, arrow, onPress) => (
    <View style={{ marginTop: 15 }}>
      <Text style={styles.infoTitle}>{title.toUpperCase()}</Text>
      <TouchableOpacity style={styles.infoTextWrapper} onPress={onPress}>
        {icon && <Image source={icon} style={styles.image} resizeMode="contain"/>}
        <Text style={styles.text}>{text}</Text>
        {arrow && <Image source={arrow} style={styles.arrow} resizeMode="contain"/>}
      </TouchableOpacity>
    </View>
  );

  handleTrashpointsPress = () => {
    const { lastTrashpoints } = this.props.team;
    this.props.navigator.push({
      screen: TEAM_TRASHPOINTS_SCREEN,
      passProps: {
        trashpoints: lastTrashpoints,
      },
      title: strings.label_text_team_trashpoints_title,
    })
  };

  spinner = () => {
    return (
      <ActivityIndicator
        style={styles.spinner}
        size="large"
        color="rgb(0, 143, 223)"
      />
    );
  };

  render() {
    const { team, loading, myTeam } = this.props;
    const btnText = team && myTeam && team.id === myTeam ? strings.label_team_leave : strings.label_team_join;
    const location = team && team.CC ? COUNTRIES_HASH[team.CC] : strings.label_text_global_team;
    const remoteImage = team && team.image ? { uri: team.image } : null;
    return loading
      ? this.spinner()
      : team && (
      <ScrollView style={styles.container}>
        {this.renderInfo(remoteImage, strings.label_team_name, team.name)}
        {myTeam && myTeam !== team.id ? null : this.renderButton(btnText)}
        {this.renderInfo(locationIcon, strings.label_team_location, location )}
        {this.renderInfo(listIcon, strings.label_team_members, team.members )}
        {this.renderInfo(trashIcon, strings.label_team_trashpoints, strings.label_team_trashpoints_tap, arrow, this.handleTrashpointsPress )}
        {this.renderInfo(null, strings.label_team_description, team.teamDescription )}
      </ScrollView>
    );
  }
}