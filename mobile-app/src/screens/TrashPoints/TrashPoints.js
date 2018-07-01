/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Dimensions,
  LayoutAnimation,
  TextInput,
  UIManager,
  View,
  Platform,
  Alert,
} from 'react-native';
import isEmpty from 'lodash/isEmpty';
import Permissions from 'react-native-permissions';
import FAB from 'react-native-fab';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Carousel from 'react-native-snap-carousel';
import has from 'lodash/has';
import { checkConnection } from '../../shared/helpers';

import { Map as MapView } from '../../components/Map';
import { DEFAULT_LOCATION, DEFAULT_ZOOM,
  MIN_ZOOM, CLIENT_ERRORS } from '../../shared/constants';
import { CREATE_MARKER, TRASH_POINT, EXPAND_SEARCH } from '../index';

import { debounce } from '../../shared/util';
import strings from '../../assets/strings';
import ImageService from '../../services/Image';
import Api from '../../api';
import { autocompleteStyle } from '../AddLocation/AddLocation';
import { SearchButton } from '../../components/Button/SearchButton';
import styles from './styles';
import { renderItem } from '../AddTrashPoints/Item/ListItem';

import { AlertModal } from '../../components/AlertModal';

const widthScreen = Dimensions.get('window').width;

const MODE = {
  list: 0,
  map: 1,
};

const searchId = 'searchId';
const DEFAULT_RADIUS_M = 10000;


class TrashPoints extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true,
    navBarBackgroundColor: 'white',
    navBarTextColor: '$textColor',
    navBarTextFontSize: 17,
    navBarTextFontFamily: 'Lato-Bold',
    statusBarColor: 'white',
    statusBarTextColorScheme: 'dark',
  }
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

    this.props.navigator.setStyle({
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
      showUserWarning: false,
      fabVisible: false,
      isFabBlock: false,
      showSearchButton: true,
      expandSearch: false,
    };

    this.cancelButton = {
      text: strings.label_button_cancel,
      onPress: this.cancelPrivateDialog.bind(this),
    };

    this.registerButton = {
      text: strings.label_register,
      onPress: this.handleLogInPress.bind(this),
    };

    UIManager.setLayoutAnimationEnabledExperimental
      && UIManager.setLayoutAnimationEnabledExperimental(true);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    try {
      setTimeout(async () => {
        this.setVisible().then((res) => {
          if (res === 'authorized') {
            this.getPosition().then(() => {
              this.watchID = navigator.geolocation.watchPosition((position) => {
                this.getLocation(position);
                const { latitude, longitude } = position.coords;
                const initialRegion = {
                  longitude,
                  latitude,
                  latitudeDelta: DEFAULT_ZOOM,
                  longitudeDelta: DEFAULT_ZOOM,
                };
                if (this.map && this.isMapReady) {
                  this.map.animateToRegion(initialRegion, 2000);
                  setTimeout(() => this.onSearchArea(), 3000);
                }
              });
            });
          } else {
            setTimeout(() => this.onSearchArea(), 3000);
          }
        });
      }, 2000);
    } catch (ex) {
      console.log('===> getPosition Error', ex);
    }
    if (!this.props.datasetUUIDSelector) {
      this.props.onFetchDatasetUUIDAction();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mapTrashPoints && this.props.mapTrashPoints
            && nextProps.mapTrashPoints.join('') === this.props.mapTrashPoints.join('')) {
      return;
    }
    this.toggleSearchButton(false);
    if (isEmpty(nextProps.mapTrashPoints)) {
      this.toggleSearchButton(true);
    }
    if (nextProps.mapTrashPoints) {
      const listTrashPoints = nextProps.mapTrashPoints
        .filter(trashPoint => !trashPoint.count);
      const firstId = listTrashPoints && listTrashPoints.length > 0
        ? listTrashPoints[0].id
        : -1;

      const markers = nextProps.mapTrashPoints.map((mapTrashPoint) => {
        if (mapTrashPoint.count !== 1) {
          return {
            ...mapTrashPoint,
            latlng: mapTrashPoint.location,
            isSelected: firstId === mapTrashPoint.id,
          };
        }
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
  onSearchArea = () => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = this.state.region;
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
    }, 500);
  };

  onMarkerPress(marker) {
    const trashpoint = this.state.mapTrashPoints.find(
      trash => trash.id === marker.id,
    );

    if (marker && marker.count === 1) {
      const list = this.getDataList();
      this.carousel.snapToItem(list.indexOf(trashpoint), false, false, false, false);
      const markers = this.props.mapTrashPoints.map((mapTrashPoint) => {
        if (mapTrashPoint.count !== 1) {
          return {
            ...mapTrashPoint,
            latlng: mapTrashPoint.location,
            isSelected: trashpoint.id === mapTrashPoint.id,
          };
        }
      });
      this.setState((previousState) => {
        return {
          ...previousState,
          selectedItem: trashpoint,
          markers,
        };
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
  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
        case searchId: {
          this.toggleSearchFieldVisibility();
          break;
        }
        default:
      }
    }
  }
  onModeChanged(index) {
    this.setState((previousState) => {
      return {
        ...previousState,
        mode: index,
      };
    });
  }
  onQueryChange = debounce((text) => {
    this.query = text;
  }, 1000);

  async getPosition() {
    await navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.getLocation(position);
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
      (error) => {
        if (error.code === 1 && !this.props.appError) {
          this.setState({ showUserWarning: true });
        }
      },
      { enableHighAccuracy: true, timeout: 800000 },
    );
  }

  getLocation = (position) => {
    const { onFetchLocation } = this.props;
    onFetchLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  };

  setVisible = async () => {
    let permission = await Permissions.check('location').then((response) => {
      return response;
    });
    if (permission === 'undetermined') {
      permission = await Permissions.request('location').then((response) => {
        return response;
      });
    }
    switch (permission) {
      case 'authorized': { this.setState({ fabVisible: true }); return 'authorized'; }
      case 'denied': { this.setState({ fabVisible: false }); return 'denied';
      /* alert(strings.label_allow_access_to_location); */ }
      default:
    }
  };

  getDataList = () => {
    return this.state.mapTrashPoints
      ? this.state.mapTrashPoints.filter(trashPoint => !trashPoint.count)
      : [];
  }

  getMapObject = (map) => {
    this.map = map;
  };
  expandSearch = () => {
    this.setState({ expandSearch: false });
  }
  toggleSearchButton = (state) => {
    this.setState({ showSearchButton: state });
  }
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

  handleTrashPointsPress = (marker) => {
    this.props.navigator.showModal({
      screen: TRASH_POINT,
      title: strings.label_trashpoint,
      passProps: {
        trashPoint: marker,
      },
    });
  };

  isAnimateToRegionWork = false;

  isMapReady = false;

  toggleSearchFieldVisibility() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState(() => {
      return { isSearchFieldVisible: !this.isSearchFieldVisible() };
    });
  }

  closeModal = () => {
    this.setState({ showUserWarning: false });
    this.onSearchArea();
  };

  handleLogInPress = () => {
    if (Platform.OS === 'android') {
      this.cancelPrivateDialog();
    }
    const { onGuestLogIn } = this.props;
    onGuestLogIn();
  };

  cancelPrivateDialog = () => {
    this.props.navigator.dismissModal();
    this.props.navigator.dismissLightBox();
  };

  spinner() {
    return (
      <ActivityIndicator
        style={styles.spinner}
        size="large"
        color="rgb(0, 143, 223)"
      />
    );
  }

  handleSelectStatus(item) {
    if (!item || has(item, 'count')) return null;

    return item.id;
  }

  isProgressEnabled = () => {
    return this.props.isLoading;
  };

  showWarningDialog = (message, buttons) => {
    this.props.navigator.showLightBox({
      screen: 'ERROR_MODAL',
      passProps: {
        error: message,
        buttons,
      },
      style: {
        backgroundBlur: 'dark',
        tapBackgroundToDismiss: true,
      },
    });
  };

  handleFabPress = async () => {
    const { isAuthenticated, userCoord } = this.props;
    // if (!await checkConnection()) {
    //   this.showWarningDialog(CLIENT_ERRORS.networkError, []);
    //   return;
    // }
    if (isAuthenticated) {
      if (userCoord && userCoord.latitude) {
        try {
          let permission = await Permissions.check('camera').then((response) => {
            return response;
          });
          if (permission === 'undetermined') {
            permission = await Permissions.request('camera').then((response) => {
              return response;
            });
          }
          if (permission !== 'authorized') {
            Alert.alert(
              strings.label_error_modal_default_title,
              strings.label_allow_access_to_camera,
              [
                { text: strings.label_button_acknowledge,
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel' },
              ],
              { cancelable: false });
            return;
          }
          ImagePicker.openCamera({
            width: 500,
            height: 350,
            cropping: true,
            includeBase64: true }).then(async (image) => {
            const { width, height, data, path } = image;
            const uri = path;
            const base64 = data;

            const thumbnailBase64 = await ImageService.getResizedImageBase64({
              uri,
              width,
              height,
            });


            this.props.navigator.push({
              screen: CREATE_MARKER,
              title: strings.label_button_createTP_confirm_create,
              passProps: {
                photos: [{ uri, base64, thumbnail: { base64: thumbnailBase64 } }],
                coords: userCoord,
              },
            });
          });
        } catch (err) {
          this.props.onSetError(err.message);
        }
      } else {
        this.props.onSetError(strings.label_error_location_subtitle);
      }
    } else {
      const buttons = [this.cancelButton, this.registerButton];
      this.showWarningDialog(CLIENT_ERRORS.registerTPError, buttons);
    }
  };

  renderProgress = () => {
    if (this.isProgressEnabled() && (this.list ? this.list.page === 0 : true)) {
      return this.spinner();
    }
    return null;
  }
  renderContent = () => {
    const { markers, initialRegion } = this.state;

    // const checked = this.handleSelectStatus(selectedItem);

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
            }}
            handleOnMarkerPress={this.onMarkerPress.bind(this)}
            onRegionChangeComplete={this.handleOnRegionChangeComplete}
            markers={markers}
            getRef={this.getMapObject.bind(this)}
          />
        );
      }
      default:
        return null;
    }
  }


  renderCarouselItem({ item }) {
    return renderItem(
      { ...item, isIncluded: false },
      false,
      {
        backgroundColor: 'white',
        height: 82,
        width: widthScreen - 37 * 2,
        borderRadius: 4,
      },
      () => this.handleTrashPointsPress(item),
      undefined,
      true, true);
  }

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
                onChangeText={this.onQueryChange}
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
                // available options:
                // https://developers.google.com/places/web-service/autocomplete
                key: 'AIzaSyDsL-LeucaFuq26bdOQUmjOLGQ1Eu-ibdg',
                language: 'en', // language of the results
              }}
              styles={autocompleteStyle}
              nearbyPlacesAPI="GooglePlacesSearch"
              // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
              GoogleReverseGeocodingQuery={{
                // available options for GoogleReverseGeocoding API :
                // https://developers.google.com/maps/documentation/geocoding/intro
              }}
              GooglePlacesSearchQuery={{
                // available options for GooglePlacesSearch API :
                // https://developers.google.com/places/web-service/search
                rankby: 'distance',
                types: 'food',
              }}
              // filter the reverse geocoding results by types -
              // ['locality', 'administrative_area_level_3']
              // if you want to display only cities
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

  render() {
    return (
      <View style={[styles.containerContent]}>
        <View style={[styles.mainContentContainer,
          styles.containerContent,
          styles.vertical]}
        >
          <View style={{
            flex: 1,
          }}
          >
            <AlertModal
              onOverlayPress={this.closeModal}
              onPress={this.closeModal}
              visible={this.state.showUserWarning}
              title={strings.label_location_modal_title}
              subtitle={strings.label_error_location_text}
            />
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
                width: widthScreen,
              }}
              ref={(c) => {
                this.carousel = c;
              }}
              data={this.getDataList()}
              renderItem={this.renderCarouselItem.bind(this)} // Do not touch bind(this).
              // It make crash of this call
              inactiveSlideScale={0.85}
              inactiveSlideOpacity={0.7}
              sliderWidth={widthScreen}
              itemWidth={widthScreen - 37 * 2}
              onSnapToItem={(index) => {
                const markers = this.props.mapTrashPoints.map((mapTrashPoint) => {
                  if (mapTrashPoint.count !== 1) {
                    return {
                      ...mapTrashPoint,
                      latlng: mapTrashPoint.location,
                      isSelected: this.state.mapTrashPoints[index].id
                        === mapTrashPoint.id,
                    };
                  }
                });

                this.setState((previousState) => {
                  return {
                    ...previousState,
                    selectedItem: this.state.mapTrashPoints[index],
                    markers,
                  };
                });
              }}
            />

            }
          </View>
          { this.state.showSearchButton && <View style={
            [styles.searchButtonContainer,
              this.state.isSearchFieldVisible ? { top: 50 } : {}]}
          >
            <SearchButton onPress={this.onSearchArea} />
          </View>}
          <FAB
            buttonColor="rgb(225, 18, 131)"
            iconTextColor="white"
            onClickAction={this.handleFabPress}
            visible={this.state.fabVisible}
            iconTextComponent={<Icon name="plus" />}
          />
        </View>
        {this.renderProgress()}
      </View>
    );
  }
}


TrashPoints.propTypes = {
  userCoord: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  datasetUUIDSelector: PropTypes.string,
  mapTrashPoints: PropTypes.array,
  isLoading: PropTypes.bool,
  navigator: PropTypes.object,
  appError: PropTypes.string,
  onFetchDatasetUUIDAction: PropTypes.func,
  onFetchLocation: PropTypes.func,
  loadTrashPointsForMapAction: PropTypes.func,
  loadTrashPointsFromClusterAction: PropTypes.func,
  onGuestLogIn: PropTypes.func,
  onSetError: PropTypes.func,
};

export default
TrashPoints;
