import React, { Component } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import moment from 'moment';

import toUpper from 'lodash/toUpper';

import strings from '../../../assets/strings';
import { Icons } from '../../../assets/images';
import {
    Icon,
    Map,
    ReadMore,
} from '../../../components';

import { DEFAULT_ZOOM } from '../../../shared/constants';

import MainButton from '../../../components/Buttons/MainButton';

import styles from './styles';

import {
  navigatorStyle,
  navigatorButtons,
  calendarConfig,
  backId,
} from './config';

class EventDetails extends Component {

  static navigatorStyle = navigatorStyle;
  static navigatorButtons = navigatorButtons;

  constructor(props) {
    super(props);

    props.navigator.setOnNavigatorEvent(
        this.onNavigatorEvent,
    );

    this.state = {
      visible: true,
    };
  }

  componentWillMount() {
    const { eventId, onLoadEvent } = this.props;

    onLoadEvent(eventId);
  }

  onNavigatorEvent = (event) => {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
        case backId: {
          this.props.navigator.dismissModal();
          break;
        }
      }
    }
  }

  handleEventJoin = () => console.log('Join Event');

  handleRenderImage() {
    const { event } = this.props;
    if (event && !event.img) {
      return (
        <Image
          style={{ height: 200, flex: 1, resizeMode: 'cover' }}
          source={{ uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png' }}
        />
      );
    }
  }

  handleRenderButton() {
    return (
      <View style={styles.buttonContainer}>
        <MainButton
          isValid
          text={strings.lable_join_event}
          style={styles.button}
          onPress={this.handleEventJoin}
        />
      </View>
    );
  }

  handleRenderDate() {
    const { event } = this.props;
    const formatedDate = moment(event.createDate).format('DD MMMM, HH:mm');
    const calendarTime = moment(event.createDate).calendar(null, calendarConfig);
    return (
      <View style={styles.dateContainer}>
        <Icon path={Icons.Time} />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatedDate}</Text>
          <Text style={styles.calendarText}>{calendarTime}</Text>
        </View>
      </View>
    );
  }

  handleRenderLocation() {
    const { event } = this.props;

    const initialRegion = {
      latitude: event.location.latitude,
      longitude: event.location.longitude,
      latitudeDelta: DEFAULT_ZOOM * 2,
      longitudeDelta: DEFAULT_ZOOM * 2,
    };

    const marker = {
      latlng: {
        latitude: event.location.latitude,
        longitude: event.location.longitude,
      },
    };

    return (
      <View>
        <View style={styles.locationContainer}>
          <Icon path={Icons.Map} />
          <Text style={styles.locationText}>Sukhumvit 20, Bangkok, Thailand</Text>
        </View>
        <View style={styles.mapContainer}>
          <Map
            markers={[marker]}
            region={initialRegion}
            // liteMode
          />
        </View>
      </View>
    );
  }

  handleRenderCircle() {
    return (
      <View style={styles.circleContainer}>
        <Text style={styles.circleText}>5</Text>
      </View>
    );
  }

  handleRenderTrashpoints() {
    return (
      <View style={styles.trashpointsContainer}>
        <Icon path={Icons.Trashpoints} />
        <Text style={styles.locationText}>{strings.label_tap_to_preview_trashpoints}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {this.handleRenderCircle()}
          <Icon path={Icons.Back} iconStyle={{ transform: [{ rotate: '180deg' }] }} />
        </View>
      </View>
    );
  }

  handleRenderDescription() {
    const { event } = this.props;
    return (
      <ReadMore
        numberOfLines={3}
        style={styles.readMoreContainer}
      >
        <Text style={styles.locationText}>
          {event.description}
        </Text>
      </ReadMore>
    );
  }

  spinner() {
    return (
      <ActivityIndicator
        style={styles.spinner}
        size="large"
        color="rgb(0, 143, 223)"
      />
    );
  }

  render() {
    const { event } = this.props;

    if (!event) return this.spinner();

    console.log('Event', this.props);
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.container}>
          {this.handleRenderImage()}
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{event.name}</Text>
          </View>
          {this.handleRenderButton()}
          <Text style={styles.title}>{toUpper(strings.lable_date_and_time)}</Text>
          {this.handleRenderDate()}
          <Text style={styles.title}>{toUpper(strings.label_location)}</Text>
          {this.handleRenderLocation()}
          <Text style={styles.title}>{toUpper(strings.label_trashpoints)}</Text>
          {this.handleRenderTrashpoints()}
          <Text style={styles.title}>{toUpper(strings.label_description)}</Text>
          {this.handleRenderDescription()}
        </View>
      </ScrollView>
    );
  }
}

EventDetails.propTypes = {
  event: PropTypes.object,
  error: PropTypes.object,
  eventId: PropTypes.string,
  navigator: PropTypes.object,
  onLoadEvent: PropTypes.func,
};

export default EventDetails;
