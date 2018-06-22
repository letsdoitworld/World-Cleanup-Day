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
import { COUNTRIES_HASH } from '../../shared/countries';

export default class Team extends Component {

  componentDidMount() {
    const { onFetchTeam, teamId } = this.props;
    onFetchTeam(teamId);
  }

  renderButton = (btnText) => (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity style={[styles.button, { backgroundColor: btnText === 'Leave' ? '#DF1E83' : '#1791DC' }]} onPress={this.handleBtnClick}>
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
    this.props.navigator.push({
      screen: 'TEAM_TRASHPOINTS_SCREEN',
      title: 'Team Trashpoints',
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
    const btnText = team && myTeam && team.id === myTeam ? 'Leave' : 'Join';
    const location = team && team.CC ? COUNTRIES_HASH[team.CC] : 'Global';
    const remoteImage = team && team.image ? { uri: team.image} : null;
    return loading
      ? this.spinner()
      : team && (
      <ScrollView style={styles.container}>
        {this.renderInfo(remoteImage, 'name', team.name)}
        {this.renderButton(btnText)}
        {this.renderInfo(locationIcon, 'location', location )}
        {this.renderInfo(listIcon, 'joined Members', `${team.members}/40` )}
        {this.renderInfo(trashIcon, 'reported trashpoints', 'Tap to preview trashpoints', arrow, this.handleTrashpointsPress )}
        {this.renderInfo(null, 'description', team.teamDescription )}
      </ScrollView>
    );
  }
}