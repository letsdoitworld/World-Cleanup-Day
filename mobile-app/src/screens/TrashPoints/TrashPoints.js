import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    LayoutAnimation,
    PermissionsAndroid,
    TextInput,
    UIManager,
    View,
} from 'react-native';

import FAB from 'react-native-fab';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Carousel from 'react-native-snap-carousel';

import { Map as MapView } from '../../components/Map';
import { DEFAULT_LOCATION, DEFAULT_ZOOM, MIN_ZOOM } from '../../shared/constants';
import { CREATE_MARKER, TRASH_POINT } from '../index';
import styles from '../Events/styles';
import { debounce } from '../../shared/util';
import strings from '../../assets/strings';
import ImageService from '../../services/Image';
import Api from '../../api';
import { autocompleteStyle } from '../AddLocation/AddLocation';
// import styles from './styles';
import { renderItem } from '../AddTrashPoints/Item/ListItem';

const { width } = Dimensions.get('window');

const MODE = {
  list: 0,
  map: 1,
};

const searchId = 'searchId';
const DEFAULT_RADIUS_M = 10000;


class TrashPoints extends Component {

  static navigatorButtons = {
    rightButtons: [
      {
        icon: require('../../../src/assets/images/icSearchBlack24Px.png'),
        id: searchId,
      },
    ],

  };

  constructor(props) {
    super(props);
    isMapReady = false;

    this.props.navigator.setStyle({
            // navBarCustomView: EVENTS_NAV_BAR,
            // statusBarColor: 'white',
            //  statusBarTextColorScheme: 'dark',
            //  navBarBackgroundColor: 'white',
            // navBarCustomViewInitialProps: {
            //     index: MODE.map,
            //     handleIndexChange: this.onModeChanged.bind(this),
            // },
      navBarTitleTextCentered: true,
      navBarBackgroundColor: 'white',
      navBarTextColor: '$textColor',
      navBarTextFontSize: 17,
      navBarTextFontFamily: 'Lato-Bold',
      statusBarColor: 'white',
      statusBarTextColorScheme: 'dark',
    });

    const { mapTrashPoints, userCoord } = props;

    const initialRegion = userCoord || DEFAULT_LOCATION;

    const region = { ...initialRegion };

    this.state = {
      radius: DEFAULT_RADIUS_M,
      markers: undefined,
      mapTrashPoints,
      mode: MODE.map,
      isSearchFieldVisible: false,
      updateRegion: true,
      selectedItem: undefined,
      region,
      initialRegion,
      userCoord,
    };
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onModeChanged(index) {
    this.setState((previousState) => {
      return {
        ...previousState,
        mode: index,
      };
    });
  }

  isSearchFieldVisible() {
    return this.state.isSearchFieldVisible;
  }

  toggleSearchFieldVisibility() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState((previousState) => {
      return { isSearchFieldVisible: !this.isSearchFieldVisible() };
    });
        // if (!this.isSearchFieldVisible() && (this.query ? this.query.length > 0 : false)) {
        //     this.query = undefined;
        // if (this.list) {
        //     this.list.page = 0;
        // }
        // this.loadEvents(0);
        // }
  }


  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
        case searchId: {
          this.toggleSearchFieldVisibility();
          break;
        }
      }
    }
  }

  componentDidMount() {
        // TODO This is workaround!! Think how normal fix this issue
    try {
      setTimeout(() => {
        navigator.geolocation.getCurrentPosition(
                    (position) => {
                      this.getLocation(position);

                      const { latitude, longitude } = position.coords;

                      const initialRegion = {
                        longitude,
                        latitude,
                        latitudeDelta: DEFAULT_ZOOM,
                        longitudeDelta: DEFAULT_ZOOM,
                      };

                      if (this.isMapReady) {
                        this.map.animateToRegion(initialRegion, 1500);
                      }
                    },
                    error => console.log('Error', error),
                    { enableHighAccuracy: false, timeout: 600000 },
                );
      }, 2000);
    } catch (ex) {
      console.log('Error', ex);
    }

    if (!this.props.datasetUUIDSelector) {
      this.props.onFetchDatasetUUIDAction();
    }
  }

  getLocation = (position) => {
    const { onFetchLocation } = this.props;
    onFetchLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.mapTrashPoints && this.props.mapTrashPoints
            && nextProps.mapTrashPoints.join('') === this.props.mapTrashPoints.join('')) {
      return;
    }

    if (nextProps.mapTrashPoints) {
      const listTrashPoints = nextProps.mapTrashPoints.filter(trashPoint => !trashPoint.count);
      const firstId = listTrashPoints && listTrashPoints.length > 0
                ? listTrashPoints[0].id
                : -1;

      const markers = nextProps.mapTrashPoints.map((mapTrashPoint) => {
        return {
          ...mapTrashPoint,
          latlng: mapTrashPoint.location,
          isSelected: firstId === mapTrashPoint.id,
        };
      });

      this.setState((previousState) => {
        return {
          ...previousState,
          mapTrashPoints: nextProps.mapTrashPoints,
          markers,
        };
      });
    }
  }

  onMarkerPress(marker) {
    if (marker && !marker.count) {
      this.props.navigator.push({
        screen: TRASH_POINT,
        title: strings.label_trashpoint,
        passProps: {
          trashPoint: marker,
        },
      });
    } else if (this.map && marker.count) {
      const { latitude, longitude, latitudeDelta, longitudeDelta } = this.region;
      const northWest = {
        latitude: this.adjustLatitude(latitude + latitudeDelta / 2),
        longitude: this.adjustLongitude(longitude - longitudeDelta / 2),
      };
      const southEast = {
        latitude: this.adjustLatitude(latitude - latitudeDelta / 2),
        longitude: this.adjustLongitude(longitude + longitudeDelta / 2),
      };

      const cell = Api.trashPoints.calculateCell(northWest, southEast);
      const delta = Api.trashPoints.calculateDelta(northWest, southEast, this.region);
      if (this.state.region.latitudeDelta === MIN_ZOOM) {
        return this.setState({
          updateRegion: false,
        }, () => {
          this.props.loadTrashPointsFromClusterAction(
                        cell,
                        marker.coordinates,
                        marker.id,
                        this.props.datasetUUIDSelector,
                        this.props.mapTrashPoints,
                    );
        });
      }
      const region = {
        ...marker.latlng,
        ...delta,
      };
      this.map.animateToRegion(region, 300);
    }
  }

  getMapObject = (map) => {
    this.map = map;
  };

  isSearchFieldVisible() {
    return this.state.isSearchFieldVisible;
  }

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

  handleOnRegionChangeComplete = (center) => {
    this.region = center;

    if (!this.state.updateRegion) {
      this.setState((previousState) => {
        return {
          ...previousState,
          updateRegion: true,
          region: center,
        };
      });
    }

    const { latitude, longitude, latitudeDelta, longitudeDelta } = center;
    const northWest = {
      latitude: this.adjustLatitude(latitude + latitudeDelta / 2),
      longitude: this.adjustLongitude(longitude - longitudeDelta / 2),
    };
    const southEast = {
      latitude: this.adjustLatitude(latitude - latitudeDelta / 2),
      longitude: this.adjustLongitude(longitude + longitudeDelta / 2),
    };

    const delta = {
      latitudeDelta,
      longitudeDelta,
    };

    if (this.props.datasetUUIDSelector) {
      this.props.loadTrashPointsForMapAction({
        datasetId: this.props.datasetUUIDSelector,
        viewPortLeftTopCoordinate: northWest,
        viewPortRightBottomCoordinate: southEast,
        delta,
      });
    }
  };

  render() {
    return (
      <View style={[styles.containerContent]}>
        <View style={[styles.mainContentContainer, styles.containerContent, styles.vertical]}>
          <View style={{
            flex: 1,
          }}
          >
            {this.renderContent()}
            {this.renderSearchBox()}
            {this.state.mode === MODE.map &&
            <Carousel
              containerCustomStyle={{
                position: 'absolute',
                bottom: 8,
                left: 0,
                right: 0,
                flex: 1,
                height: 82,
                width,
              }}
              ref={(c) => {
                this._carousel = c;
              }}
              data={this.state.mapTrashPoints ? this.state.mapTrashPoints.filter(trashPoint => !trashPoint.count) : []}
              renderItem={this.renderCarouselItem}
              inactiveSlideScale={0.85}
              inactiveSlideOpacity={0.7}
              sliderWidth={width}
              itemWidth={width - 37 * 2}
              onSnapToItem={(index) => {
                const markers = this.props.mapTrashPoints.map((mapTrashPoint) => {
                  return {
                    ...mapTrashPoint,
                    latlng: mapTrashPoint.location,
                    isSelected: this.state.mapTrashPoints[index].id === mapTrashPoint.id,
                  };
                });

                this.setState((previousState) => {
                  return {
                    ...previousState,
                    selectedItem: this.state.mapTrashPoints[index],
                    markers,
                  };
                });

                                // const region = {
                                //     latitudeDelta: this.state.region.latitudeDelta,
                                //     longitudeDelta: this.state.region.longitudeDelta,
                                //     latitude: this.state.mapTrashPoints[index].location.latitude,
                                //     longitude: this.state.mapTrashPoints[index].location.longitude,
                                //   };


                                // this.map.animateToRegion(region, 300);
              }}
            />

                        }
          </View>
          <FAB
            buttonColor="rgb(225, 18, 131)"
            iconTextColor="white"
            onClickAction={this.handleFabPress.bind(this)}
            visible
            iconTextComponent={<Icon name="plus" />}
          />
        </View>
        {this.renderProgress()}
      </View>
    );
  }

  renderCarouselItem({ item, index }) {
    return renderItem(
            { ...item, isIncluded: false },
            false,
      {
        backgroundColor: 'white',
        height: 82,
        width: width - 37 * 2,
      },
            undefined,
            undefined,
            true);
  }

  renderContent() {
    const { selectedItem, mapTrashPoints, markers, region, initialRegion } = this.state;

    switch (this.state.mode) {
      case MODE.list: {
        return null;
      }
      case MODE.map: {
        return (
          <MapView
            initialRegion={initialRegion}
            onMapReady={() => {
              this.isMapReady = true;
              this.map.animateToRegion(initialRegion, 1500);
            }}
            handleOnMarkerPress={this.onMarkerPress.bind(this)}
            onRegionChangeComplete={this.handleOnRegionChangeComplete.bind(this)}
            markers={markers}
            getRef={this.getMapObject.bind(this)}
          />
        );
      }
      default:
        return null;
    }
  }


  handleFabPress = async () => {
    const { isAuthenticated } = this.props;

    if (isAuthenticated) {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          alert(strings.label_allow_access_to_camera);
          return;
        }

        const image = await ImagePicker.openCamera({
          width: 500,
          height: 350,
          cropping: true,
          includeBase64: true,
        });

        const { width, height, data, path } = image;
        const uri = path;
        const base64 = data;

        const thumbnailBase64 = await ImageService.getResizedImageBase64({
          uri,
          width,
          height,
        });

        if (this.props.userCoord && this.props.userCoord.latitude) {
          this.props.navigator.push({
            screen: CREATE_MARKER,
            title: strings.label_button_createTP_confirm_create,
            passProps: {
              photos: [{ uri, thumbnail: { base64: thumbnailBase64 }, base64 }],
              coords: this.props.userCoord,
            },
          });
        } else {
          this.showAlert();
        }
      } catch (err) {
        alert(strings.label_allow_access_to_camera);
      }
    } else {
      Alert.alert(
                strings.label_private_auth_wor_title,
                strings.label_private_auth_trashpoint_wor,
        [
          {
            text: 'Cancel',
            onPress: () => {
            },
            style: 'cancel',
          },
                    { text: 'Register', onPress: this.handleLogInPress },
        ],
            );
    }
  };

  showAlert() {
    Alert.alert(
            'Error',
            strings.label_error_location_subtitle,
      [
                { text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      ],
        );
  }

  isProgressEnabled() {
    return this.props.isLoading;
  }

  renderProgress() {
    if (this.isProgressEnabled() && (this.list ? this.list.page === 0 : true)) {
      return this.spinner();
    }
    return null;
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

  handleLogInPress = () => {
    const { onGuestLogIn } = this.props;
    onGuestLogIn();
  };

  renderSearchBox() {
    if (this.isSearchFieldVisible()) {
      switch (this.state.mode) {
        case MODE.list: {
          return (
            <View style={[styles.horizontal, styles.searchContainerStyle]}>
              <TextInput
                placeholderTextColor={'rgb(41, 127, 202)'}
                style={styles.searchField}
                ref="input"
                onChangeText={this.onQueryChange.bind(this)}
                placeholder={strings.label_text_select_country_hint}
                underlineColorAndroid={'transparent'}
              />
            </View>
          );
        }
        case MODE.map: {
          return (
            <GooglePlacesAutocomplete
              placeholder={strings.label_text_select_country_hint}
              minLength={2}
              autoFocus={false}
              returnKeyType={'search'}
              listViewDisplayed="auto"
              fetchDetails
              renderDescription={row => row.description}
              onPress={(data, details = null) => {
                const latitude = details.geometry.location.lat;
                const longitude = details.geometry.location.lng;


                const region = {
                  latitudeDelta: DEFAULT_ZOOM,
                  longitudeDelta: DEFAULT_ZOOM,
                  latitude,
                  longitude,
                };


                this.map.animateToRegion(region, 300);
              }}
              getDefaultValue={() => ''}
              query={{
                                // available options: https://developers.google.com/places/web-service/autocomplete
                key: 'AIzaSyDsL-LeucaFuq26bdOQUmjOLGQ1Eu-ibdg',
                language: 'en', // language of the results
                types: '(cities)', // default: 'geocode'
              }}
              styles={autocompleteStyle}
              nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
              GoogleReverseGeocodingQuery={{
                                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
              }}
              GooglePlacesSearchQuery={{
                                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                rankby: 'distance',
                types: 'food',
              }}
              filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
              debounce={200}
            />
          );
        }
        default:
          return null;
      }
    }
    return null;
  }


  onQueryChange = debounce(function (text) {
    this.query = text;
  }, 1000);
}


TrashPoints.propTypes = {
  userCoord: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  country: PropTypes.object,
  onFetchLocation: PropTypes.func,
  loadTrashPointsForMapAction: PropTypes.func,
  onGuestLogIn: PropTypes.func,
};

export default
    TrashPoints;
