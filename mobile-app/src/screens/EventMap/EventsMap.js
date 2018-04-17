import React, {Component} from 'react';
import {FlatList, UIManager, View} from 'react-native';


import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';

import {Event, Map as MapView} from '../../components';
import {DEFAULT_LOCATION, MIN_ZOOM} from '../../shared/constants';
import strings from '../../config/strings';
import {EVENT_DETAILS_SCREEN} from '../index';
import {Backgrounds} from '../../assets/images';

import styles from './styles';

const cancelId = 'cancelId';
const saveId = 'saveId';
const DEFAULT_RADIUS_M = 10000;

export default class EventsMap extends Component {

  static navigatorStyle = styles.navigatorStyle;

  marked = new Map();

  constructor(props) {
    super(props);
    const { initialRegion, onLoadMapEventsAction, mapEvents } = props;
    let userLocation;
    if (initialRegion === undefined || initialRegion === null) {
      userLocation = DEFAULT_LOCATION;
    } else {
      userLocation = initialRegion;
    }
    const region = { ...userLocation };

    this.state = {
      markers: undefined,
      mapEvents,
      emptyEvents: undefined,
      userLocation,
      radius: DEFAULT_RADIUS_M,
      selectedItem: undefined,
      updateRegion: true,
      region,
    };

    this.handleVisibleChange = debounce(this.getVisibleRows, 200);
    this.viewabilityConfig = { viewAreaCoveragePercentThreshold: 70 };

    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  handleEventPress = (event, imageIndex) => {
    this.props.navigator.showModal({
      screen: EVENT_DETAILS_SCREEN,
      title: strings.label_event,
      passProps: {
        eventId: event.id,
        imageIndex,
      },
    });
  };

  componentDidMount() {
    if (!this.props.datasetUUIDSelector) {
      this.props.onFetchDatasetUUIDAction();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState((previousState) => {
      return {
        mapEvents: nextProps.mapEvents,
      };
    });
  }

  onCheckedChanged(checked, item) {
        // if (checked) {
        //     this.marked.set(item.id, item)
        // } else {
        //     this.marked.delete(item.id)
        // }

    const markers = this.props.mapEvents.map((mapEvents) => {
      return {
        id: mapEvents.id,
        latlng: mapEvents.location,
        item: mapEvents,
      };
    });
    this.setState((previousState) => {
      return {
        ...previousState,
        markers,
      };
    });
  }

  onPressMarker = (event) => {
    const marker = this.state.mapEvents.find(
            marker => marker.id === event.id,
        );

    this.setState((previousState) => {
      return {
        selectedItem: marker,
      };
    });

    if (!marker.isTrashpile) {
      return;
    }

    if (marker && !marker.count) {
            // TODO add smooth animation to scroll
      this.flatListRef.scrollToItem({ animated: true, item: marker });
    } else if (this.map && has(this.props, 'delta.latitudeDelta')) {
      if (this.props.delta.latitudeDelta === MIN_ZOOM) {
        return this.setState({
          updateRegion: false,
        }, () => {
          this.props.onLoadEventsFromClusterAction({
            cellSize: this.props.delta.cellSize,
            coordinates: marker.coordinates,
            clusterId: marker.id,
            datasetId: this.props.datasetUUIDSelector,
            markers: this.props.mapEvents,
          });
        });
      }
      const region = {
        ...this.props.delta,
        ...marker.location,
      };
      this.map.animateToRegion(region, 100);
    }
  };

  handleOnRegionChangeComplete = (center) => {
    if (!this.state.updateRegion) {
        this.setState((previousState) => {
            return {
                ...previousState,
                updateRegion: true,
                region: center,
              };
          });
      }
    const adjustLongitude = (n) => {
      if (n < -180) {
        return 360 + n;
      }
      if (n > 180) {
        return n - 360;
      }
      return n;
    };
    const adjustLatitude = (n) => {
      const signMultiplier = n > 0 ? 1 : -1;
      if (Math.abs(n) > 90) {
        return signMultiplier * 89.999;
      }

      return n;
    };

    const { latitude, longitude, latitudeDelta, longitudeDelta } = center;
    const northWest = {
      latitude: adjustLatitude(latitude + latitudeDelta / 2),
      longitude: adjustLongitude(longitude - longitudeDelta / 2),
    };
    const southEast = {
      latitude: adjustLatitude(latitude - latitudeDelta / 2),
      longitude: adjustLongitude(longitude + longitudeDelta / 2),
    };

    const delta = {
      latitudeDelta,
      longitudeDelta,
    };

    if (this.props.datasetUUIDSelector) {
      this.props.onLoadMapEventsAction({
        datasetId: this.props.datasetUUIDSelector,
        viewPortLeftTopCoordinate: northWest,
        viewPortRightBottomCoordinate: southEast,
        delta,
      });
    }
  };

  selectImage = (imageIndex) => {
    switch (imageIndex) {
      case 0: return Backgrounds.firstEmptyEvent;
      case 1: return Backgrounds.secondEmptyEvent;
      case 2: return Backgrounds.thirdEmptyEvent;
    }
  }

  keyExtractor = (item, index) => item.id.toString();

  renderItem(event) {
    const empty = this.state.mapEvents.map(e => {if(isEmpty(e.photos)) return e}).filter(e => {return typeof e!== 'undefined'})
    const imageIndex = empty.indexOf(event) !== -1
      ? empty.indexOf(event) % 3
      : null;
    const coverPhoto = !isEmpty(event.photos) ? { uri: event.photos[0] } : this.selectImage(imageIndex);
    return (
      <Event
        img={coverPhoto}
        title={event.name}
        coordinatorName={event.coordinatorName}
        date={event.startTime}
        maxParticipants={event.maxPeopleAmount}
        participants={event.peopleAmount}
        containerStyle={styles.eventContainer}
        imageStyle={styles.eventImage}
        feedBackType="withoutFeedBack"
        onPress={() => this.handleEventPress(event, imageIndex)}
      />
    );
  }

  renderHeader = () => {
    return (<View style={styles.emptyStyle} />);
  };

  handleSelectStatus(item) {
    if (!item || has(item, 'count')) return null;

    return item.id;
  }

  getVisibleRows = ({ viewableItems }) => {
    if (!isEmpty(viewableItems)) {
      this.setState({ selectedItem: viewableItems[0].item });
    }
  }

  render() {
    const { initialRegion } = this.props;
    const { selectedItem, mapEvents, userLocation, region } = this.state;

    const checked = this.handleSelectStatus(selectedItem);

    let listEvents = [];
    let markers = [];
    if (mapEvents && mapEvents !== undefined) {
      listEvents = mapEvents.filter(event => event.count === undefined);
      markers = mapEvents.map((mapEvents) => {
        return {
          ...mapEvents,
          latlng: mapEvents.location,
        };
      });
    }
    return (
      <View style={styles.container}>
        <MapView
          onRegionChangeComplete={this.handleOnRegionChangeComplete}
          markers={markers}
          initialRegion={userLocation}
          style={styles.map}
          handleOnMarkerPress={this.onPressMarker}
          selectedItem={checked}
          region={region === userLocation && this.state.updateRegion === false ? this.state.region : undefined}
          getRef={map => this.map = map}
        />

        <FlatList
          ref={(ref) => { this.flatListRef = ref; }}
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={this.renderHeader.bind(this)}
          data={listEvents}
          horizontal
          keyExtractor={this.keyExtractor.bind(this)}
          renderItem={({ item }) => this.renderItem(item)}
          onViewableItemsChanged={this.handleVisibleChange}
          viewabilityConfig={this.viewabilityConfig}
        />

      </View>
    );
  }
}
