import React, { Component } from 'react';
import { UIManager, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import Permissions from 'react-native-permissions';
import { Event, Map as MapView } from '../../components';
import { DEFAULT_LOCATION, DEFAULT_ZOOM } from '../../shared/constants';
import strings from '../../assets/strings';
import { EVENT_DETAILS_SCREEN } from '../index';
import { Backgrounds } from '../../assets/images';
import styles from './styles';
import LocationAlertModal from '../../components/AlertModal/LocationAlertModal';
import { SearchButton } from '../../components/Button/SearchButton';
import Api from '../../api';
import CarouselList from '../../components/CarouselList/CarouselList';
import { requestPermission } from '../../shared/permissionHelper';
import { getCurrentPosition } from '../../shared/geo';
import CurrentLocationButton
  from '../../components/CurrentLocationButton/CurrentLocationButton';

const widthScreen = Dimensions.get('window').width;
const DEFAULT_RADIUS_M = 10000;

export default class EventsMap extends Component {
  static navigatorStyle = styles.navigatorStyle;

  constructor(props) {
    super(props);
    const { initialRegion, mapEvents, actualRegion } = props;
    let userLocation;
    if ((initialRegion === undefined && actualRegion === undefined)
        || initialRegion === null && actualRegion === undefined
    || (initialRegion && !initialRegion.latitude && actualRegion === undefined)) {
      userLocation = DEFAULT_LOCATION;
    } else {
      userLocation = !actualRegion ? initialRegion : actualRegion;
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
      cellSize: undefined,
    };

    this.handleVisibleChange = debounce(this.getVisibleRows, 200);
    this.viewabilityConfig = { viewAreaCoveragePercentThreshold: 70 };

    UIManager.setLayoutAnimationEnabledExperimental
      && UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  componentDidMount() {
    if (!this.props.datasetUUIDSelector) {
      this.props.onFetchDatasetUUIDAction();
    }
    this.props.onRef(this);
    this.handleLocationOnEvent(true);
  }

  componentWillReceiveProps(nextProps) {
    if (isEmpty(nextProps.mapEvents)) {
      this.toggleSearchButton(true);
      this.setState(() => {
        return {
          mapEvents: [],
          selectedItem: {},
        };
      });
    }
    let mapEvents = [];
    if (!isEmpty(nextProps.mapEvents)) {
      this.checkLocationPermission().then((res) => {
        if (res === 'authorized') {
          mapEvents = nextProps.mapEvents;

          if (this.state.selectedItem) {
            return;
          }
          const coruselEvents = mapEvents
            .filter((event) => {
              return event.count === 1;
            });
          const selectedItem = coruselEvents[0];
          this.setState(() => {
            return {
              mapEvents,
              selectedItem,
            };
          });
          this.carousel.snapToItem(
            coruselEvents.indexOf(selectedItem),
            false, false, false, false);
        } else {
          mapEvents = nextProps.mapEvents;
          const selectedItem = mapEvents[0];
          this.setState(() => {
            return {
              mapEvents,
              selectedItem,
            };
          });
          this.carousel.snapToItem(
            this.state.mapEvents.indexOf(selectedItem),
            false, false, false, false);
        }
      });
    }
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
      const coruselEvents =
          this.state.mapEvents.filter((ev) => { return ev.count === 1; });
      this.carousel.snapToItem(
        coruselEvents.indexOf(marker),
        false, false, false, false);
    } else if (this.map) {
      const { latitude, longitude, latitudeDelta, longitudeDelta } = this.state.region;
      const northWest = {
        latitude: this.adjustLatitude(latitude + latitudeDelta / 2),
        longitude: this.adjustLongitude(longitude - longitudeDelta / 2),
      };
      const southEast = {
        latitude: this.adjustLatitude(latitude - latitudeDelta / 2),
        longitude: this.adjustLongitude(longitude + longitudeDelta / 2),
      };

      const delta = Api.events.calculateDelta(northWest, southEast, this.state.region);

      const region = {
        ...delta,
        ...marker.location,
      };
      this.map.animateToRegion(region, 300);
      this.setState({
        updateRegion: false,
      });
      setTimeout(() => this.loadEventsOnArea(), 3000);
    }
  };
  getVisibleRows = ({ viewableItems }) => {
    if (!isEmpty(viewableItems)) {
      this.setState({ selectedItem: viewableItems[0].item });
    }
  };

  setLocation = (position) => {
    const { onChangeUserLocation } = this.props;
    if (position && position.latitude) {
      onChangeUserLocation({
        latitude: position.latitude,
        longitude: position.longitude,
      });
    }
  };

  async getPosition(isNeedLoadEvent) {
    try {
      const initialRegion = await getCurrentPosition();
      const { latitude, longitude } = initialRegion;
      if (!isNeedLoadEvent) {
        const location = initialRegion && initialRegion.latitude
          ? initialRegion : DEFAULT_LOCATION;
        if (this.map) {
          this.map.animateToRegion(location, 300);
        }
      }
      this.setLocation(initialRegion);
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
    } catch (error) {
      this.props.onChangeUserLocation({
        latitude: null,
        longitude: null,
      });
      this.setState({ showUserWarning: true });
    }
  }

  handleLocationOnEvent(isNeedLoadEvent) {
    try {
      this.checkLocationPermission().then((res) => {
        if (res === 'authorized') {
          this.getPosition();
          if (isNeedLoadEvent === true) {
            setTimeout(() => this.loadEventsOnArea(), 2000);
          }
        } else {
          this.setState({ showUserWarning: true });
        }
      });
    } catch (ex) {
      console.log(ex);
    }
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
  adjustLongitude = (n) => {
    if (n < -180) {
      return 360 + n;
    }
    if (n > 180) {
      return n - 360;
    }
    return n;
  };
  adjustLatitude = (n) => {
    const signMultiplier = n > 0 ? 1 : -1;
    if (Math.abs(n) > 90) {
      return signMultiplier * 89.999;
    }

    return n;
  };
  toRad(Value) {
    return Value * Math.PI / 180;
  }

  calcCrow = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const radlat1 = this.toRad(lat1);
    const radlat2 = this.toRad(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radlat1) * Math.cos(radlat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }
  loadEventsOnArea = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        selectedItem: undefined,
      };
    });
    const { latitude, longitude, latitudeDelta, longitudeDelta } = this.state.region;
    const northWest = {
      latitude: this.adjustLatitude(latitude + latitudeDelta / 2),
      longitude: this.adjustLongitude(longitude - longitudeDelta / 2),
    };
    const southEast = {
      latitude: this.adjustLatitude(latitude - latitudeDelta / 2),
      longitude: this.adjustLongitude(longitude + longitudeDelta / 2),
    };
    const cellSize = Api.events.calculateCell(northWest, southEast);
    this.setState({ cellSize });

    // this.props.onViewPortUpdate({ nw: northWest, se: southEast });

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
  };

  toggleSearchButton = (state) => {
    this.setState({ showSearchButton: state });
  };

  handleOnRegionChangeComplete = (center) => {
    if (center !== this.state.region) {
      this.toggleSearchButton(true);
    }
    this.props.onChangeRegion(center);
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
  };

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
    if (!item || item.count !== 1) return null;

    return item.id;
  }

  snapToItem(index, listEvents) {
    this.setState((previousState) => {
      return {
        ...previousState,
        selectedItem: listEvents[index],
      };
    });
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
        participants={event.attendeesAmount}
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
      listEvents = mapEvents.filter(event => event.count === 1);
      markers = mapEvents.map((mapEvent) => {
        return {
          ...mapEvent,
          latlng: mapEvent.location,
        };
      });
    }
    return (
      <View style={styles.container}>
        <LocationAlertModal
          onOverlayPress={this.closeModal}
          onPress={this.closeModal}
          onDismiss={this.onDismiss}
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
        { this.state.showSearchButton && <View style={
          [styles.searchButtonContainer,
            this.state.isSearchFieldVisible ? { top: 50 } : {}]}
        >
          <SearchButton onPress={this.loadEventsOnArea} />
        </View>}
        <CurrentLocationButton
          onCurrentLocationPress={this.handleLocationOnEvent.bind(this)}
          style={styles.currentLocationStyle}
        />
        <CarouselList
          onRef={(ref) => { this.carousel = ref; }}
          list={listEvents}
          widthScreen={widthScreen}
          renderCarouselItem={this.renderItem.bind(this)}
          onSnapToItem={this.snapToItem.bind(this)}
        />
      </View>
    );
  }

  async onDismiss() {
    await requestPermission('location');
  }
}

EventsMap.propTypes = {
  initialRegion: PropTypes.object,
  mapEvents: PropTypes.array,
  datasetUUIDSelector: PropTypes.string,
  navigator: PropTypes.object,
  onFetchDatasetUUIDAction: PropTypes.func,
  onLoadEventsFromClusterAction: PropTypes.func,
  onLoadMapEventsAction: PropTypes.func,
  onViewPortUpdate: PropTypes.func.isRequired,
  onChangeUserLocation: PropTypes.func,
};
