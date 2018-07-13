import React, { Component } from 'react';
import { FlatList, Text, View, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import toString from 'lodash/toString';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import arrow from '../../assets/images/icon_menu_arrowforward.png';
import { EVENT_DETAILS_SCREEN,
  SETTINGS_SCREEN,
  TRASH_POINT,
  TEAM_SCREEN } from '../index';
import strings from '../../assets/strings';
import { Icons,
  Backgrounds,
  expandSearch,
  ImageJoinUs } from '../../assets/images';
import { Avatar,
  Button,
  Divider,
  Event,
  Icon,
  Tabs,
  Trashpoint } from '../../components';

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
      selectedTab: 'events',
    };
  }


  componentDidMount() {
    const {
      isAuthenticated,
      isGuestSession,
      onFetchProfile,
      onLoadMyEvents,
      onLoadMyTrashPoints,
      allowed,
    } = this.props;
    if (!isAuthenticated && isGuestSession) {
      // This is issue of wix navigation
      // https://github.com/wix/react-native-navigation/issues/767
      this.props.navigator.setButtons({
        rightButtons: [],
      });

      return;
    }
    onFetchProfile();

    if (allowed) {
      onLoadMyEvents(15, 1);
      onLoadMyTrashPoints(15, 1);

      this.props.navigator.setButtons({
        rightButtons: [
          {
            icon: Icons.Settings,
            id: 'settings',
          },
        ],
      });
    }
    this.props.navigator.setButtons({
      rightButtons: this.rightButtons,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { profile, countryCode, updateProfileCountry } = this.props;
    if (!isEqual(nextProps.myEvents, this.props.myEvents)) {
      this.setState({ isEndEventsReached: false });
      this.eventsPageNumber += 1;
    }

    if (!isEqual(nextProps.myTrashPoints, this.props.myTrashPoints)) {
      this.setState({ isEndTrashpointReached: false });
    }
    if ((nextProps.profile && !nextProps.profile.country
      && countryCode) || nextProps.countryCode
      && profile && !profile.country) {
      updateProfileCountry({ country: !countryCode
        ? nextProps.countryCode : countryCode },
      );
    }
    if (this.props.createTrashPoint.success) {
      setTimeout(() => this.props.onLoadMyTrashPoints(15, 1), 10000);
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

  onRenderTrashPoints = () => {
    const { myTrashPoints } = this.props;
    if (isEmpty(myTrashPoints)) {
      return <View style={styles.findNothingContainer}>
        <Image source={expandSearch} style={styles.findNothingImage} />
        <Text style={styles.findNothingTitle}>{strings.label_no_trashpoints}</Text>
        <Text style={styles.findNothingText}>{strings.label_time_to_contribute}</Text>
      </View>;
    }
    return (
      <FlatList
        style={styles.tabContent}
        data={myTrashPoints}
        refreshing={this.props.myTrashPointsLoading}
        onRefresh={() => this.props.onLoadMyTrashPoints(15, 1)}
        renderItem={({ item }) => this.handleRenderTrashpoint(item)}
        keyExtractor={this.handleKeyExtractor}
        onEndReachedThreshold={0.5}
        extraData={this.state}
        onEndReached={this.handleTrashpointsPagination}
      />
    );
  };

  onRenderEvents = () => {
    if (isEmpty(this.props.myEvents)) {
      return <View style={styles.findNothingContainer}>
        <Image source={Backgrounds.EmptyTrashpoints} style={styles.findNothingImage} />
        <Text style={styles.findNothingTitle}>{strings.label_no_events}</Text>
        <Text style={styles.findNothingText}>{strings.label_time_to_contribute}</Text>
      </View>;
    }
    return (
      <FlatList
        style={styles.tabContent}
        data={this.props.myEvents}
        refreshing={this.props.myEventsLoading}
        onRefresh={() => this.props.onLoadMyEvents(15, 1)}
        renderItem={({ item }) => this.handleRenderEvents(item)}
        keyExtractor={this.handleKeyExtractor}
        onEndReachedThreshold={0.5}
        onEndReached={this.handleEventPagination}
      />
    );
  };

  rightButtons = [
    {
      icon: Icons.Settings,
      id: 'settings',
    },
  ];

  handleRenderTrashpoint(trashpoint) {
    return (
      <View style={styles.trashpointContainer}>
        <Trashpoint
          type={trashpoint.status}
          location={trashpoint.address}
          onPress={() => this.handleTrashpointPress(trashpoint)}
        />
      </View>
    );
  }

  handleRenderPhoneNumber() {
    const { profile } = this.props;

    if (profile && profile.phoneNumber) {
      return (
        <View>
          <View style={styles.additionalInfoContainer}>
            <Icon path={Icons.Phone} />
            <Text style={styles.additionalInfoText}>{profile.phoneNumber}</Text>
          </View>
          <Divider />
        </View>
      );
    }
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

  handleRenderTeam = () => {
    const { profile } = this.props;
    if (profile && profile.team && profile.teamInfo) {
      return (
        <View>
          <TouchableOpacity
            style={styles.teamContainer}
            onPress={() => this.props.navigator.push({
              screen: TEAM_SCREEN,
              passProps: { teamId: profile.team },
              title: strings.label_text_team,
            })}
          >
            <Icon path={Icons.GroupPeople} />
            <Text style={styles.additionalInfoText}>{profile.teamInfo.name}</Text>
            <Image source={arrow} style={styles.arrow} resizeMode="contain" />
          </TouchableOpacity>
          <Divider />
        </View>
      );
    }
  };

  handleEventPress = (event, imageIndex) => {
    this.props.navigator.showModal({
      screen: EVENT_DETAILS_SCREEN,
      title: strings.label_event,
      passProps: {
        eventId: event.id,
        imageIndex,
        onEventDeleted: this.props.onClearEvents,
      },
    });
  };

  handleTrashpointPress = (trashpoint) => {
    this.props.navigator.showModal({
      screen: TRASH_POINT,
      title: strings.label_trashpoint,
      passProps: {
        trashPoint: trashpoint,
      },
    });
  };

  handleEventPagination = () => {
    const { eventsPageSize, myEvents, onLoadMyEvents } = this.props;
    let { eventsPageNumber } = this.props;
    eventsPageNumber++;

    if (isEmpty(myEvents)) return;

    if (!this.state.isEndEventsReached && !(myEvents.length % eventsPageSize)) {
      onLoadMyEvents(eventsPageSize, eventsPageNumber);
    }
  };

  handleTrashpointsPagination = () => {
    const { trashpointsPageSize, myTrashPoints, onLoadMyTrashPoints } = this.props;
    let { trashpointsPageNumber } = this.props;
    trashpointsPageNumber++;

    if (isEmpty(myTrashPoints)) return;

    if (!this.state.isEndTrashpointReached
        &&
        !(myTrashPoints.length % trashpointsPageSize)
    ) {
      onLoadMyTrashPoints(trashpointsPageSize, trashpointsPageNumber);
      this.setState({ isEndTrashpointReached: true });
    }
  };

  selectImage = (imageIndex) => {
    switch (imageIndex) {
      case 0: return Backgrounds.firstEmptyEvent;
      case 1: return Backgrounds.secondEmptyEvent;
      case 2: return Backgrounds.thirdEmptyEvent;
      default:
    }
  };

  handleRenderEvents(event) {
    const imageIndex = this.props.myEmptyEvents.indexOf(event) !== -1
      ? this.props.myEmptyEvents.indexOf(event) % 3
      : null;
    const coverPhoto = imageIndex !== null
      ? this.selectImage(imageIndex)
      : { uri: event.photos[0] };
    return (
      <Event
        key={event.id}
        img={coverPhoto}
        title={event.name}
        coordinator={event.coordinator}
        address={event.address}
        date={event.startTime}
        maxParticipants={event.maxPeopleAmount}
        participants={event.peopleAmount}
        onPress={() => this.handleEventPress(event, imageIndex)}
      />
    );
  }

  handleKeyExtractor = event => toString(event.id);

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  showAlert(error) {
    throw (error);
  }

  handleRenderLocation() {
    const { profile } = this.props;
    if (profile && profile.country) {
      return (
        <View style={styles.locationContainer}>
          <Icon path={Icons.Location} />
          <Text style={styles.locationText}>{profile.country}</Text>
        </View>
      );
    }
  }

  previousError = undefined;
  handleRenderGuestProfile = () => {
    return (
      <View style={styles.guestContainer}>
        <View style={styles.imgPlaceholder}>
          <Image source={ImageJoinUs} />
        </View>
        <Button
          onPress={this.props.onGuestLogIn}
          text={strings.label_join_us}
        />
      </View>
    );
  };

  render() {
    const { isAuthenticated, isGuestSession, profile } = this.props;
    const tabs = [
      { content: this.onRenderEvents, name: strings.label_events },
      { content: this.onRenderTrashPoints, name: strings.label_trashpoints },
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
        {this.handleRenderEmail()}
        {this.handleRenderTeam()}
        <Tabs tabs={tabs} />
      </View>
    );
  }
}

Profile.propTypes = {
  country: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  countryCode: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  isGuestSession: PropTypes.bool,
  eventsPageNumber: PropTypes.number,
  eventsPageSize: PropTypes.number,
  trashpointsPageSize: PropTypes.number,
  trashpointsPageNumber: PropTypes.number,
  myEmptyEvents: PropTypes.object,
  profile: PropTypes.object,
  navigator: PropTypes.object,
  myEvents: PropTypes.object,
  myEventsLoading: PropTypes.bool,
  myTrashPoints: PropTypes.object,
  myTrashPointsLoading: PropTypes.bool,
  onFetchProfile: PropTypes.func,
  onGuestLogIn: PropTypes.func,
  onLoadMyEvents: PropTypes.func,
  onLoadMyTrashPoints: PropTypes.func,
  updateProfileCountry: PropTypes.func,
  createTrashPoint: PropTypes.object,
};

export default Profile;
