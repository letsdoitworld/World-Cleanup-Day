import React, { Component } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import PropTypes from 'prop-types';

import { SceneMap } from 'react-native-tab-view';

import toString from 'lodash/toString';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';

import { SETTINGS_SCREEN, EVENT_DETAILS_SCREEN } from '../index';
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

import { navigatorStyle } from './config';

class Profile extends Component {

  static navigatorStyle = navigatorStyle;

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(
            this.onNavigatorEvent.bind(this),
        );

    this.state = {
      visible: true,
      isEndEventsReached: false,
      isEndTrashpointReached: false,
    };
  }

  componentDidMount() {
    const {
        isAuthenticated,
        isGuestSession,
        onFetchProfile,
        onLoadMyEvents,
        onLoadMyTrashPoints,
    } = this.props;

    onFetchProfile();
    onLoadMyEvents(15, 1);
    onLoadMyTrashPoints(15, 1);

    if (!isAuthenticated && isGuestSession) {
      this.props.navigator.setButtons({
        rightButtons: [],
        leftButtons: [
          {
            icon: Icons.Notification,
            id: 'notification',
          },
        ],
      });

      return;
    }

    this.props.navigator.setButtons({
      rightButtons: [
        {
          icon: Icons.Settings,
          id: 'settings',
        },
      ],
      leftButtons: [
        {
          icon: Icons.Notification,
          id: 'notification',
        },
      ],
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.myEvents, this.props.myEvents)) {
      this.setState({ isEndEventsReached: false });
      this.eventsPageNumber += 1;
    }

    if (!isEqual(nextProps.myTrashPoints, this.props.myTrashPoints)) {
      this.setState({ isEndTrashpointReached: false });
    }
  }

  componentDidUpdate() {
    const { myEventsError, myTrashPointsError } = this.props;
    if (!isNil(myEventsError) && !isNil(myTrashPointsError)) {
      this.showAlert(myEventsError);
    }
    if (!isNil(myTrashPointsError) && !isNil(myEventsError)) {
      this.showAlert(myTrashPointsError);
    }
  }

  onNavigatorEvent(event) {
    if (event.id === 'willAppear') {
      this.setState({
        visible: true,
      });
    }
    if (event.id === 'willDisappear') {
      this.setState({
        visible: false,
      });
    }

    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'settings') {
        this.props.navigator.push({
          screen: SETTINGS_SCREEN,
          title: strings.label_settings_header,
        });
      }
    }
  }

  showAlert(error) {
    Alert.alert(
            'Error',
            error,
      [
                { text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      ],
        );
  }

  componentWillUnmount() {
    const { onLoadMyEventsError, onLoadMyTrashPointsError } = this.props;
    onLoadMyEventsError(null);
    onLoadMyTrashPointsError(null);
  }

  handleRenderLocation() {
    const { country } = this.props;

    if (country && country.name) {
      return (
        <View style={styles.locationContainer}>
          <Icon path={Icons.Location} />
          <Text style={styles.locationText}>{country.name}</Text>
        </View>
      );
    }
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

  handleEventPress = (event) => {
    this.props.navigator.showModal({
      screen: EVENT_DETAILS_SCREEN,
      title: strings.label_event,
      passProps: {
        eventId: event.id,
      },
    });
  };

  handleTrashpointPress = () => {
    console.log('handleTrashpointPress');
  };

  handleEventPagination = () => {
    const { eventsPageSize, myEvents, onLoadMyEvents } = this.props;
    let { eventsPageNumber } = this.props;

    if (!this.state.isEndEventsReached) {
      if(!!(myEvents && (myEvents.length % eventsPageSize))) return;

      onLoadMyEvents(eventsPageSize, ++eventsPageNumber);
      this.setState({ isEndEventsReached: true });
    }
  }

  handleTrashpointsPagination = () => {
    const { trashpointsPageSize, myEvents, onLoadMyTrashPoints } = this.props;
    let { trashpointsPageNumber } = this.props;

    if (!this.state.isEndTrashpointReached) {
      if(!!(myEvents && (myEvents.length % trashpointsPageSize))) return;

      onLoadMyTrashPoints(trashpointsPageSize, ++trashpointsPageNumber);
      this.setState({ isEndTrashpointReached: true });
    }
  };

  handleRenderEvents(event) {
    return (
      <Event
        img={event.photo}
        title={event.name}
        coordinator={event.coordinator}
        address={event.address}
        date={event.createDate}
        maxParticipants={event.maxPeopleAmount}
        participants={event.peopleAmount}
        onPress={() => this.handleEventPress(event)}
      />
    );
  }

  handleRenderTrashpoint(trashpoint) {
    return (
      <Trashpoint
        type={trashpoint.type}
        location={trashpoint.address}
        onPress={this.handleTrashpointPress}
      />
    );
  }

  handleKeyExtractor = event => toString(event.id);


  onRenderEvents = () => {
    return (
      <FlatList
        style={styles.tabContent}
        data={this.props.myEvents}
        renderItem={({ item }) => this.handleRenderEvents(item)}
        keyExtractor={this.handleKeyExtractor}
        onEndReachedThreshold={0.5}
        onEndReached={this.handleEventPagination}
      />
    );
  };


  onRenderTrashPoints = () => {
    const { myTrashPoints } = this.props;
    return (
      <FlatList
        style={styles.tabContent}
        data={myTrashPoints}
        renderItem={({ item }) => this.handleRenderTrashpoint(item)}
        keyExtractor={this.handleKeyExtractor}
        onEndReachedThreshold={0.5}
        extraData={this.state}
        onEndReached={this.handleTrashpointsPagination}
      />
    );
  };


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
  };


  render() {
    const { isAuthenticated, isGuestSession, profile } = this.props;
    const { visible } = this.state;

    // const scenes = {
    //     [strings.label_events]: this.onRenderEvents,
    //     [strings.label_trashpoints]: this.onRenderTrashPoints,
    //   };

    const routes = [
        { key: strings.label_events, title: strings.label_events },
        { key: strings.label_trashpoints, title: strings.label_trashpoints },
    ];

    const renderSceneTab = SceneMap({
      [strings.label_events]: this.onRenderEvents,
      [strings.label_trashpoints]: this.onRenderTrashPoints,
    });

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
                // scenes={scenes}
          routes={routes}
          isVisible={visible}
          renderSceneTab={renderSceneTab}
        />
      </View>
    );
  }
}

Profile.propTypes = {
  country: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  isGuestSession: PropTypes.bool,
  profile: PropTypes.object,
  navigator: PropTypes.object,
  myEvents: PropTypes.object,
  myEventsError: PropTypes.object,
  myTrashPoints: PropTypes.object,
  myTrashPointsError: PropTypes.object,
  onFetchProfile: PropTypes.func,
  onGuestLogIn: PropTypes.func,
  onLoadMyEvents: PropTypes.func,
  onLoadMyTrashPoints: PropTypes.func,
  onLoadMyTrashPointsError: PropTypes.func,
  onLoadMyEventsError: PropTypes.func,
};

export default Profile;
