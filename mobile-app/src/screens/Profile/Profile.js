import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import PropTypes from 'prop-types';

import toString from 'lodash/toString';

import { SETTINGS_SCREEN } from '../index';
import strings from '../../config/strings';
import { Icons } from '../../assets/images';
import {
  Avatar,
  Icon,
  Divider,
  Tabs,
  Event,
  Trashpoint,
  Button,
} from '../../components';

import styles from './styles';

import { navigatorStyle, navigatorButtons } from './config';

import { EVENTS, TRASHPOINTS } from './data';

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
    const { isAuthenticated, onFetchProfile } = this.props;

    if (isAuthenticated) {
      onFetchProfile();
    }

    this.handleGetCurrentPosition();
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
  }

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
      <View>
        <View style={styles.additionalInfoContainer}>
          <Icon path={Icons.Phone} />
          <Text style={styles.additionalInfoText}>+3809500000000</Text>
        </View>
        <Divider />
      </View>
    );
  }

  handleRenderEmail() {
    const { profile } = this.props;

    if (profile && profile.email) {
      return (
        <View>
          <View style={styles.additionalInfoContainer}>
            <Icon path={Icons.Email} />
            <Text style={styles.additionalInfoText}>{profile.email}</Text>
          </View>
          <Divider />
        </View>
      );
    }
  }

  handleEventPress = () => {
    console.log('Event Press');
  }

  handleTrashpointPress = () => {
    console.log('handleTrashpointPress');
  }

  handleRenderEvents(event) {
    return (
      <Event
        img={event.photo}
        title={event.description}
        coordinator={event.coordinator}
        location={event.location}
        date={event.createDate}
        maxParticipants={event.maxPeople}
        participants={event.people}
        onPress={this.handleEventPress}
      />
    );
  }

  handleRenderTrashpoint(trashpoint) {
    return (
      <Trashpoint
        type={trashpoint.type}
        location={trashpoint.location}
        onPress={this.handleTrashpointPress}
      />
    );
  }

  handleKeyExtractor = event => toString(event.id);

  onRenderEvents = () => {
    return (
      <FlatList
        style={styles.tabContent}
        data={EVENTS}
        renderItem={({ item }) => this.handleRenderEvents(item)}
        keyExtractor={this.handleKeyExtractor}
        onEndReachedThreshold={0.5}
        onEndReached={() => console.log('List end reached')}
      />
    );
  }
  
  onRenderTrashPoints = () => {
    return (
      <FlatList
        style={styles.tabContent}
        data={TRASHPOINTS}
        renderItem={({ item }) => this.handleRenderTrashpoint(item)}
        keyExtractor={this.handleKeyExtractor}
        onEndReachedThreshold={0.5}
        onEndReached={() => console.log('List end reached')}
      />
    );
  }


  handleRenderGuestProfile = () => {
    return (
      <View style={styles.guestContainer}>
        <View style={styles.imgPlaceholder} />
        <Button
          onPress={this.props.onGuestLogIn}
          text="Log In"
        />
      </View>
    );
  }


  render() {
    const { isAuthenticated, isGuestSession, profile } = this.props;

    const scenes = {
      [strings.label_events]: this.onRenderEvents,
      [strings.label_trashpoints]: this.onRenderTrashPoints,
    };

    const routes = [
      { key: strings.label_events, title: strings.label_events },
      { key: strings.label_trashpoints, title: strings.label_trashpoints },
    ];

    if (!isAuthenticated && isGuestSession) return this.handleRenderGuestProfile();

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
        {this.handleRenderEmail()}
        <Tabs
          scenes={scenes}
          routes={routes}
        />
      </View>
    );
  }
}

Profile.propTypes = {
  isAuthenticated: PropTypes.bool,
  isGuestSession: PropTypes.bool,
  profile: PropTypes.object,
  navigator: PropTypes.object,
  onFetchProfile: PropTypes.func,
  onGuestLogIn: PropTypes.func,
};

export default Profile;
