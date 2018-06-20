import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import icon from '../../assets/images/icons/pin/icInactiveAdded.png';
import listIcon from '../../assets/images/icons/icList.png';
import trashIcon from '../../assets/images/icons/icTrashpointsInActive.png';
import styles from './styles';
import { COUNTRIES_HASH } from '../../shared/countries';

export default class Team extends Component {

  componentDidMount() {
    const { onFetchTeam, teamId } = this.props;
    onFetchTeam(teamId);
  }

  renderButton = () => (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.btnText}>Join</Text>
      </TouchableOpacity>
    </View>
  );

  renderInfo = (icon, title, text) => (
    <View style={{ marginTop: 15 }}>
      <Text style={styles.infoTitle}>{title.toUpperCase()}</Text>
      <TouchableOpacity style={styles.infoTextWrapper}>
        {icon && <Image source={icon} style={styles.image} resizeMode="contain"/>}
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
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

  render() {
    const { team, loading } = this.props;
    const location = team && team.CC ? COUNTRIES_HASH[team.CC] : 'Global';
    const remoteImage = {
      uri: team.image
    };
    return loading
      ? this.spinner()
      : (
      <ScrollView style={styles.container}>
        {this.renderInfo(remoteImage, 'name', team.name)}
        {this.renderButton()}
        {this.renderInfo(icon, 'location', location )}
        {this.renderInfo(listIcon, 'joined Members', `${team.members}/40` )}
        {this.renderInfo(trashIcon, 'reported trashpoints', 'Tap to preview trashpoints' )}
        {this.renderInfo(null, 'description', team.teamDescription )}
      </ScrollView>
    );
  }
}