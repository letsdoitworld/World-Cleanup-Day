import React, { Component } from 'react';
import { UIManager, View, Dimensions, Platform } from 'react-native';
import PropTypes from 'prop-types';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import Permissions from 'react-native-permissions';
import Carousel from 'react-native-snap-carousel';
import { Event, Map as MapView } from '../../components';
import { DEFAULT_LOCATION, DEFAULT_ZOOM, MIN_ZOOM } from '../../shared/constants';
import strings from '../../assets/strings';
import { EVENT_DETAILS_SCREEN, EXPAND_SEARCH } from '../index';
import { Backgrounds } from '../../assets/images';
import styles from './styles';
import { AlertModal } from '../../components/AlertModal';
import { SearchButton } from '../../components/Button/SearchButton';

const widthScreen = Dimensions.get('window').width;
const DEFAULT_RADIUS_M = 10000;

export default class EventsMap extends Component {
  static navigatorStyle = styles.navigatorStyle;

  constructor(props) {
    super(props);
    const { initialRegion, mapEvents } = props;
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
      showUserWarning: false,
      showSearchButton: true,
      expandSearch: false,
    };

    this.handleVisibleChange = debounce(this.getVisibleRows, 200);
    this.viewabilityConfig = { viewAreaCoveragePercentThreshold: 70 };

    UIManager.setLayoutAnimationEnabledExperimental
      && UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  componentDidMount() {
    this.props.onRef(this);
    if (!this.props.initialRegion) {
      try {
        this.checkLocationPermission().then((res) => {
          if (res === 'authorized') {
            this.getPosition.bind(this);
            setTimeout(() => this.loadEventsOnArea(), 2000);
          }
        });
      } catch (ex) {
        console.log(ex);
      }
    } else {
      this.checkLocationPermission().then((res) => {
        if (res === 'authorized') {
          setTimeout(() => this.loadEventsOnArea(), 2000);
        }
      });
    }

    if (!this.props.datasetUUIDSelector) {
      this.props.onFetchDatasetUUIDAction();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (isEmpty(nextProps.mapEvents)) {
      this.toggleSearchButton(true);
    }
    let mapEvents = [];
    if (!isEmpty(nextProps.mapEvents)) {
      mapEvents = nextProps.mapEvents.filter((event) => { return event.count !== 1; });
    }
    this.setState(() => {
      return {
        mapEvents,
        selectedItem: isEmpty(mapEvents) ? {} : mapEvents[0],
      };
    });
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }
  onCheckedChanged = () => {
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
  };

  onPressMarker = (event) => {
    const marker = this.state.mapEvents.find(
      mark => mark.id === event.id,
    );

    this.setState(() => {
      return {
        selectedItem: marker,
      };
    });

    if (!marker.isTrashpile) {
      return;
    }

    if (marker && marker.count === 1) {
      this.carousel.snapToItem(
        this.state.mapEvents.indexOf(marker),
        false, false, false, false);
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
  getVisibleRows = ({ viewableItems }) => {
    if (!isEmpty(viewableItems)) {
      this.setState({ selectedItem: viewableItems[0].item });
    }
  };
  async getPosition() {
    await navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.setState((previousState) => {
          return {
            ...previousState,
            userLocation: {
              longitude,
              latitude,
              latitudeDelta: DEFAULT_ZOOM,
              longitudeDelta: DEFAULT_ZOOM,
            },
          };
        });
      },
      (error) => {
        if (error.code === 1) {
          this.setState({ showUserWarning: true });
        }
      },
      { enableHighAccuracy: false, timeout: 600000 },
    );
  }
  checkLocationPermission = async () => {
    const permission = await Permissions.check('location').then((response) => {
      return response;
    });
    switch (permission) {
      case 'authorized': { return 'authorized'; }
      case 'denied': { return 'denied'; }
      default: { return 'denied'; }
    }
  };
  loadEventsOnArea = () => {
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
    const { latitude, longitude, latitudeDelta, longitudeDelta } = this.state.region;
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

    this.props.onLoadMapEventsAction({
      datasetId: this.props.datasetUUIDSelector,
      viewPortLeftTopCoordinate: northWest,
      viewPortRightBottomCoordinate: southEast,
      delta,
    });
    this.toggleSearchButton(false);
    setTimeout(() => {
      if (this.props.isEmpty) {
        this.props.navigator.showLightBox({
          screen: EXPAND_SEARCH,
          passProps: {
            onPress: () => {
              if (Platform.OS === 'ios') {
                this.props.navigator.dismissModal();
              }
              this.props.navigator.dismissLightBox();
            },
          },
          style: {
            tapBackgroundToDismiss: true,
            backgroundBlur: 'dark',
          },
        });
      }
      this.props.synchronizeEvents(this.state.mapEvents);
    }, 500);
  }
  expandSearch = () => {
    this.setState({ expandSearch: false });
  }
  toggleSearchButton = (state) => {
    this.setState({ showSearchButton: state });
  }

  handleOnRegionChangeComplete = (center) => {
    if (center !== this.state.region) {
      this.toggleSearchButton(true);
    }
    this.setState((previousState) => {
      return {
        ...previousState,
        updateRegion: true,
        region: center,
      };
    });
  };

  selectImage = (imageIndex) => {
    switch (imageIndex) {
      case 0: return Backgrounds.firstEmptyEvent;
      case 1: return Backgrounds.secondEmptyEvent;
      case 2: return Backgrounds.thirdEmptyEvent;
      default:
    }
  }

  keyExtractor = item => item.id.toString();
  closeModal = () => {
    this.setState({ showUserWarning: false });
  };

  marked = new Map();

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

  handleSelectStatus(item) {
    if (!item || has(item, 'count')) return null;

    return item.id;
  }

  renderHeader = () => {
    return (<View style={styles.emptyStyle} />);
  };

  renderItem(event) {
    const empty = this.state.mapEvents.map((e) => {
      if (isEmpty(e.photos)) return e; return undefined;
    }).filter((e) => { return typeof e !== 'undefined'; });
    const imageIndex = empty.indexOf(event) !== -1
      ? empty.indexOf(event) % 3
      : null;
    const coverPhoto = !isEmpty(event.photos)
      ? { uri: event.photos[0] }
      : this.selectImage(imageIndex);
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

  render() {
    const { selectedItem, mapEvents, userLocation, showUserWarning } = this.state;

    const checked = this.handleSelectStatus(selectedItem);

    let listEvents = [];
    let markers = [];
    if (mapEvents && mapEvents !== undefined) {
      listEvents = mapEvents.filter(event => event.count === undefined);
      markers = mapEvents.map((mapEvent) => {
        return {
          ...mapEvent,
          latlng: mapEvent.location,
        };
      });
    }
    return (
      <View style={styles.container}>
        <AlertModal
          onOverlayPress={this.closeModal}
          onPress={this.closeModal}
          visible={showUserWarning}
          title={strings.label_location_modal_title}
          subtitle={strings.label_error_location_text}
        />
        <MapView
          onRegionChangeComplete={this.handleOnRegionChangeComplete}
          markers={markers}
          initialRegion={userLocation}
          style={styles.map}
          handleOnMarkerPress={this.onPressMarker}
          selectedItem={checked}
          region={this.state.region === userLocation && this.state.updateRegion === false
            ? this.state.region : undefined}
          getRef={(map) => { this.map = map; }}
        />
        { this.state.showSearchButton && <View style={[styles.searchButtonContainer,
          !this.props.searchVisible ? { top: 50 } : {}]}
        >
          <SearchButton onPress={this.loadEventsOnArea} />
        </View>}
        <Carousel
          containerCustomStyle={{
            position: 'absolute',
            bottom: 8,
            left: 0,
            right: 0,
            flex: 1,
            height: 82,
            width: widthScreen,
          }}
          ref={(c) => {
            this.carousel = c;
          }}
          data={listEvents}
          renderItem={({ item }) => this.renderItem(item)}
          inactiveSlideScale={0.85}
          inactiveSlideOpacity={0.7}
          sliderWidth={widthScreen}
          itemWidth={widthScreen - 37 * 2}
          onSnapToItem={(index) => {
            this.setState((previousState) => {
              return {
                ...previousState,
                selectedItem: mapEvents[index],
                markers,
              };
            });
          }}
        />

      </View>
    );
  }
}

EventsMap.propTypes = {
  initialRegion: PropTypes.object,
  mapEvents: PropTypes.array,
  datasetUUIDSelector: PropTypes.string,
  navigator: PropTypes.object,
  delta: PropTypes.array,
  onFetchDatasetUUIDAction: PropTypes.func,
  onLoadEventsFromClusterAction: PropTypes.func,
  onLoadMapEventsAction: PropTypes.func,
};
