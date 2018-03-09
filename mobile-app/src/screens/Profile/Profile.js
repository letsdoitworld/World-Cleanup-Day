import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

import { SETTINGS_SCREEN } from '../index';
import strings from '../../config/strings';
import { Icons } from '../../assets/images';
import { Avatar, Icon, Divider } from '../../components';

import styles from './styles';

import { navigatorStyle, navigatorButtons } from './config';

class Profile extends Component {

  static navigatorStyle = navigatorStyle;
  static navigatorButtons = navigatorButtons;

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
    );
  }

  componentDidMount() {
    const { onFetchProfile } = this.props;

    onFetchProfile();
    this.handleGetCurrentPosition();
    console.log('componentDidMount', this.props);
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps);
  }

  onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'settings') {
        this.props.navigator.push({
          screen: SETTINGS_SCREEN,
          title: strings.label_settings_header,
        });
      }
    }
  }

  handleGetCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('latitude', position.coords.latitude, 'longitude', position.coords.longitude);
      },
      error => console.log('Error', error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };

  handleRenderLocation() {
    return (
      <View style={styles.locationContainer}>
        <Icon path={Icons.Location} />
        <Text style={styles.locationText}>Ukraine</Text>
      </View>
    );
  }

  handleRenderPhoneNumber() {
    return (
      <View style={styles.additionalInfoContainer}>
        <Icon path={Icons.Phone} />
        <Text style={styles.additionalInfoText}>+3809500000000</Text>
      </View>
    );
  }

  handleRenderEmail() {
    return (
      <View style={styles.additionalInfoContainer}>
        <Icon path={Icons.Email} />
        <Text style={styles.additionalInfoText}>yonder@gmail.com</Text>
      </View>
    );
  }

  render() {
    const { profile } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <View style={styles.avatarContainer}>
            <Avatar path={profile && profile.pictureURL} />
            <View style={styles.userNameContainer}>
              <Text style={styles.userNameText}>{profile && profile.name}</Text>
              {this.handleRenderLocation()}
            </View>
          </View>
        </View>
        <Divider />
        {this.handleRenderPhoneNumber()}
        <Divider />
        {this.handleRenderEmail()}
        <Divider />
      </View>
    );
  }
}

Profile.propTypes = {
  profile: PropTypes.object,
  onFetchProfile: PropTypes.func,
};

export default Profile;
