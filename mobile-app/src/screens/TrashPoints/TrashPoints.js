/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  View,
} from 'react-native';
import isEmpty from 'lodash/isEmpty';
import Permissions from 'react-native-permissions';
import FAB from 'react-native-fab';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import has from 'lodash/has';
import { checkConnection } from '../../shared/helpers';

import { Map as MapView } from '../../components/Map';
import { CLIENT_ERRORS, DEFAULT_LOCATION, DEFAULT_ZOOM } from '../../shared/constants';
import { CREATE_MARKER, TRASH_POINT } from '../index';

import { debounce } from '../../shared/util';
import strings from '../../assets/strings';
import ImageService from '../../services/Image';
import Api from '../../api';
import { autocompleteStyle } from '../AddLocation/AddLocation';
import { SearchButton } from '../../components/Button/SearchButton';
import styles from './styles';
import { renderItem } from '../AddTrashPoints/Item/ListItem';
import LocationAlertModal from '../../components/AlertModal/LocationAlertModal';
import CarouselList from '../../components/CarouselList/CarouselList';
import { requestPermission } from '../../shared/permissionHelper';
import {
  getCurrentPosition,
} from '../../shared/geo';
import CurrentLocationButton
  from '../../components/CurrentLocationButton/CurrentLocationButton';

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

    const initialRegion = DEFAULT_LOCATION;

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
      cellSize: undefined,
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
    this.handleLocation();
    this.props.onFetchDatasetUUIDAction();
  }

  componentWillReceiveProps(nextProps) {
    this.toggleSearchButton(false);
    if (isEmpty(nextProps.mapTrashPoints)) {
      this.toggleSearchButton(true);
    }
    if (nextProps.mapTrashPoints) {
      const listTrashPoints = nextProps.mapTrashPoints
        .filter(trashPoint => trashPoint.count === 1);
      const firstId = listTrashPoints && listTrashPoints.length > 0
        ? listTrashPoints[0].id
        : -1;

      const markers = nextProps.mapTrashPoints.map((mapTrashPoint) => {
        return {
          ...mapTrashPoint,
          latlng: mapTrashPoint.location,
          isSelected: this.state.selectedItem
            ? mapTrashPoint.id === this.state.selectedItem.id
            : firstId === mapTrashPoint.id,
        };
      });
      if (!this.state.selectedItem) {
        this.carousel.snapToItem(nextProps.mapTrashPoints
          .indexOf(this.state.selectedItem),
        false, false, false, false);
        this.setState((previousState) => {
          return {
            ...previousState,
            mapTrashPoints: nextProps.mapTrashPoints,
            markers,
          };
        });
      }
    }
    if (this.props.createTrashPoint.success) {
      setTimeout(() => this.onSearchArea(), 3000);
    }
  }

  onSearchArea = () => {
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
    const cellSize = Api.trashPoints.calculateCell(northWest, southEast);
    this.setState({ cellSize });
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

  onMarkerPress(marker) {
    const trashpoint = this.state.mapTrashPoints.find(
      trash => trash.id === marker.id,
    );

    if (marker && marker.count === 1) {
      const list = this.getDataList();
      const selectArray = list.filter((tp) => {
        return tp.count === 1;
      });
      this.carousel.snapToItem(selectArray.indexOf(trashpoint),
        false, false, false, false);

      const markers = this.props.mapTrashPoints.map((mapTrashPoint) => {
        return {
          ...mapTrashPoint,
          latlng: mapTrashPoint.location,
          isSelected: trashpoint.id === mapTrashPoint.id,
        };
      });
      this.setState((previousState) => {
        return {
          ...previousState,
          selectedItem: trashpoint,
          markers,
        };
      });
    } else {
      if (!this.map || marker.count === 1) {
        return;
      }
      const { latitude, longitude, latitudeDelta, longitudeDelta } = this.region;
      const northWest = {
        latitude: this.adjustLatitude(latitude + latitudeDelta / 2),
        longitude: this.adjustLongitude(longitude - longitudeDelta / 2),
      };
      const southEast = {
        latitude: this.adjustLatitude(latitude - latitudeDelta / 2),
        longitude: this.adjustLongitude(longitude + longitudeDelta / 2),
      };
      const delta = Api.trashPoints.calculateDelta(northWest, southEast, this.region);
      const region = {
        ...marker.latlng,
        ...delta,
      };
      this.map.animateToRegion(region, 300);
      this.setState({
        updateRegion: false,
      });
      setTimeout(() => this.onSearchArea(), 3000);
    }
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
        case searchId: {
          this.toggleSearchFieldVisibility();
          break;
        }
        case 'willDisappear': {
          navigator.geolocation.clearWatch(this.watchID);
          break;
        }
        default:
      }
    }
    if (event.type === 'ScreenChangedEvent') {
      switch (event.id) {
        case 'willDisappear': {
          //          navigator.geolocation.clearWatch(this.watchID);
          //          navigator.geolocation.stopObserving();
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

  async onDismiss() {
    await requestPermission('location');
  }

  getDataList = () => {
    return this.state.mapTrashPoints
      ? this.state.mapTrashPoints.filter(trashPoint => trashPoint.count === 1)
      : [];
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
      case 'authorized': {
        this.setState({ fabVisible: true });
        return 'authorized';
      }
      case 'denied': {
        this.setState({ fabVisible: false });
        return 'denied';
        /* alert(strings.label_allow_access_to_location); */
      }
      default:
    }
  };

  setLocation = (position) => {
    const { onFetchLocation, onChangeUserLocation, country } = this.props;
    if (position && position.latitude && !country) {
      onFetchLocation({
        latitude: position.latitude,
        longitude: position.longitude,
      });
    } else if (position && position.latitude) {
      onChangeUserLocation({
        latitude: position.latitude,
        longitude: position.longitude,
      });
    }
  };

  async getPosition(isNeedSearch) {
    try {
      const initialLocation = await getCurrentPosition();
      this.scrollToCurrentLocation(initialLocation, isNeedSearch);
    } catch (error) {
      this.getLocationFailed();
    }
  }

  getMapObject = (map) => {
    this.map = map;
  };

  getLocationFailed = () => {
    this.props.onChangeUserLocation({
      latitude: null,
      longitude: null,
    });
    this.setState({
      initialRegion: DEFAULT_LOCATION,
      showUserWarning: true,
    });
  };

  scrollToCurrentLocation = (initialLocation, isNeedSearch = false) => {
    const location = initialLocation && initialLocation.latitude
      ? initialLocation : DEFAULT_LOCATION;
    this.setLocation(initialLocation);
    if (this.map && this.isMapReady) {
      this.map.animateToRegion(location, 1500);
      if (isNeedSearch === true) {
        setTimeout(() => this.onSearchArea(), 3000);
      }
    }
  };

  handleLocation() {
    try {
      setTimeout(async () => {
        this.checkPermissionsAndHandleLocation(true);
      }, 2000);
    } catch (ex) {
      console.log('===> getPosition Error', ex);
    }
  }

  checkPermissionsAndHandleLocation(isNeedSearch) {
    this.setVisible().then(async (res) => {
      if (res === 'authorized') {
        this.getPosition(isNeedSearch);
      } else {
        this.setState({ showUserWarning: true });
      }
    });
  }

  toggleSearchButton = (state) => {
    this.setState({ showSearchButton: state });
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
    if (!await checkConnection()) {
      this.showWarningDialog(CLIENT_ERRORS.networkError, []);
      return;
    }
    if (isAuthenticated) {
      if (userCoord && userCoord.latitude) {
        try {
          const actualPosition = await getCurrentPosition();
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
                {
                  text: strings.label_button_acknowledge,
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
              ],
              { cancelable: false });
            return;
          }
          ImagePicker.openCamera({
            width: 500,
            height: 350,
            cropping: true,
            includeBase64: true,
          }).then(async (image) => {
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
                coords: actualPosition,
              },
            });
          });
        } catch (err) {
          if (err.message === 'Cannot ge location') {
            this.setState({ showUserWarning: true });
          } else {
            this.props.onSetError(err.message);
          }
        }
      } else {
        this.setState({ showUserWarning: true });
      }
    } else {
      const buttons = [this.cancelButton, this.registerButton];
      this.showWarningDialog(CLIENT_ERRORS.registerTPError, buttons);
    }
  };


  snapToItem(index, selectArray) {
    let selectedItem = selectArray[index];
    const markers = this.props.mapTrashPoints.map((mapTrashPoint) => {
      if (selectArray[index] && selectArray[index].id === mapTrashPoint.id) {
        selectedItem = mapTrashPoint;
      }
      return {
        ...mapTrashPoint,
        latlng: mapTrashPoint.location,
        isSelected: selectArray[index] ? selectArray[index].id
          === mapTrashPoint.id : false,
      };
    });
    this.setState((previousState) => {
      return {
        ...previousState,
        selectedItem,
        markers,
      };
    });
  }

  renderProgress = () => {
    if (this.isProgressEnabled() && (this.list ? this.list.page === 0 : true)) {
      return this.spinner();
    }
    return null;
  };


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
  };


  renderCarouselItem(item) {
    return renderItem(
      { ...item, isIncluded: false },
      false,
      {
        backgroundColor: 'white',
        height: 82,
        width: widthScreen - 37 * 2,
        borderRadius: 4,
      },
      () => this.handleTrashPointsPress({ ...item, photos: undefined }),
      undefined,
      true, true);
  }

  renderSearchBox() {
    switch (this.state.mode) {
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
            <LocationAlertModal
              onOverlayPress={this.closeModal}
              onDismiss={this.onDismiss}
              onPress={this.closeModal}
              visible={this.state.showUserWarning}
              title={strings.label_location_modal_title}
              subtitle={strings.label_error_location_text}
            />
            {this.renderContent()}
            {this.state.mode === MODE.map &&
            <CarouselList
              onRef={(
                ref) => {
                this.carousel = ref;
              }}
              list={this.getDataList()}
              widthScreen={widthScreen}
              renderCarouselItem={this.renderCarouselItem.bind(this)}
              onSnapToItem={this.snapToItem.bind(this)}
            />
            }
          </View>
          {this.state.showSearchButton && <View style={
            [styles.searchButtonContainer,
              this.state.isSearchFieldVisible ? { top: 50 } : {}]}
          >
            <SearchButton onPress={this.onSearchArea} />
          </View>}
          <CurrentLocationButton
            onCurrentLocationPress={this.checkPermissionsAndHandleLocation.bind(this)}
          />
          {this.renderSearchBox()}
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
  onFetchDatasetUUIDAction: PropTypes.func,
  onFetchLocation: PropTypes.func,
  onChangeUserLocation: PropTypes.func,
  loadTrashPointsForMapAction: PropTypes.func,
  onGuestLogIn: PropTypes.func,
  onSetError: PropTypes.func,
  createTrashPoint: PropTypes.object,
  country: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default TrashPoints;
