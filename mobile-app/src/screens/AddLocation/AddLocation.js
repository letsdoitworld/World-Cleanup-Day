/* eslint-disable no-undef */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { LayoutAnimation, Text, TouchableOpacity, UIManager, View } from 'react-native';
import styles from './styles';
import strings from '../../assets/strings';
import { Map } from '../../components';
import {
  DEFAULT_LOCATION,
  DEFAULT_ZOOM,
  MAX_DISTANCE_METERS_TRASHPOINT,
} from '../../shared/constants';
import { geocodeCoordinates, getCurrentPosition, getDistance } from '../../shared/geo';

import { Icons } from '../../assets/images';
import CurrentLocationButton
  from '../../components/CurrentLocationButton/CurrentLocationButton';
import LocationAlertModal from '../../components/AlertModal/LocationAlertModal';
import Permissions from "react-native-permissions";

const cancelId = 'cancelId';


const circleProps = (region) => {
  return {
    center: {
      latitude: region.latitude,
      longitude:
      region.longitude,
    },
    radius: MAX_DISTANCE_METERS_TRASHPOINT,
    borderWidth: 2,
    borderColor: '#008FDF',
    fillColor: 'rgba(0, 143, 223, 0.2)',
  };
};

export const autocompleteStyle = {
  listView: styles.searchListView,
  container: styles.searchContainer,
  textInputContainer: styles.searchTextInputContainer,
  textInput: styles.searchTextInput,
  description: styles.searchDescription,
};

class AddLocation extends Component {
  static navigatorStyle = styles.navigatorStyle;

  static navigatorButtons = {
    leftButtons: [
      {
        icon: Icons.Back,
        id: cancelId,
      },
    ],

  };

  constructor(props) {
    super(props);
    const { initialLocation } = props;
    if (!initialLocation && initialLocation !== null) {
      this.state = {
        marker: undefined,
        initialRegion: {
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: DEFAULT_ZOOM,
          longitudeDelta: DEFAULT_ZOOM,
        },
        showUserWarning: false,
      };
    } else {
      this.state = {
        marker: undefined,
        region: null,
        initialRegion: undefined,
        showUserWarning: false,
      };
    }

    UIManager.setLayoutAnimationEnabledExperimental
    && UIManager.setLayoutAnimationEnabledExperimental(true);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    if (this.state.initialRegion === undefined) {
      this.getCurrentPosition();
    }
  }


  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
        case cancelId: {
          this.props.navigator.pop();
          break;
        }
        default:
          break;
      }
    }
  }

  async onConfirmPress() {
    const { latitude, longitude } = this.state.marker.latlng;
    const place = await geocodeCoordinates(this.state.marker.latlng);
    this.props.onLocationSelected({
      latitude,
      longitude,
      place: place.mainText,
    });
    this.props.navigator.pop();
  }

  onMapPress = (e) => {
    const { initialRegion } = this.state;
    const coordinate = e.nativeEvent.coordinate;
    const longitude = coordinate.longitude;
    const latitude = coordinate.latitude;

    let distanceFromUser;
    if (initialRegion && this.props.restrictDistance) {
      distanceFromUser = getDistance(coordinate, this.state.initialRegion);
    }

    if ((distanceFromUser && distanceFromUser <= MAX_DISTANCE_METERS_TRASHPOINT)
      || !this.props.restrictDistance) {
      this.updateMarkerInState({
        latitude,
        longitude,
      });
    }
  };

  onAutocompletePress(details) {
    const location = details.geometry.location;
    const latitude = location.lat;
    const longitude = location.lng;
    const distanceFromUser = getDistance({
      latitude: location.lat,
      longitude: location.lng,
    }, this.state.initialRegion);
    if (distanceFromUser <= MAX_DISTANCE_METERS_TRASHPOINT
      || !this.props.restrictDistance) {
      this.updateMarkerInState({ latitude, longitude });
    }
  }

  setLocation = (position) => {
    const { onChangeUserLocation } = this.props;
    if (position && position.latitude) {
      onChangeUserLocation({
        latitude: position.latitude,
        longitude: position.longitude,
      });
    }
  };

  getCurrentPosition() {
    try {
      this.checkPermissions().then(async (res) => {
        if (res === 'authorized') {
          this.getPosition(false);
        } else {
          this.setState({ showUserWarning: true });
        }
      });
    } catch (error) {
      alert(JSON.stringify(error));
    }
  }

  async getPosition(isNeedChangeRegion = true) {
    try {
      const initialRegion = await getCurrentPosition();
      this.setLocation(initialRegion);
      if (this.map) {
        this.map.animateToRegion(initialRegion, 1500);
      }
      if (isNeedChangeRegion) {
        this.setState(() => {
          return {
            initialRegion,
            region: initialRegion,
          };
        });
      } else {
        this.setState(() => {
          return {
            initialRegion,
          };
        });
      }
    } catch (error) {
      this.props.onChangeUserLocation({
        latitude: null,
        longitude: null,
      });
      this.setState({ showUserWarning: true });
    }
  }

  checkPermissions = async () => {
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

  closeModal = () => {
    this.setState({ showUserWarning: false });
  };

  updateMarkerInState(latlng) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState(() => {
      return {
        marker: {
          latlng,
          id: 1,
        },
        region: {
          latitude: latlng.latitude,
          longitude: latlng.longitude,
          latitudeDelta: DEFAULT_ZOOM,
          longitudeDelta: DEFAULT_ZOOM,
        },
      };
    });
  }

  renderConfirmButton() {
    if (this.state.marker !== undefined) {
      return (
        <TouchableOpacity
          onPress={this.onConfirmPress.bind(this)}
          style={styles.confirmButton}
        >
          <Text style={styles.confirmButtonText}>
            {strings.label_confirm_location}
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  }

  render() {
    const region = (this.state.initialRegion)
      ? this.state.initialRegion : DEFAULT_LOCATION;
    return (
      <View style={styles.container}>
        <LocationAlertModal
          onOverlayPress={this.closeModal}
          onPress={this.closeModal}
          visible={this.state.showUserWarning}
          title={strings.label_location_modal_title}
          subtitle={strings.label_error_location_text}
        />
        <Map
          region={this.state.region}
          circleProps={region && this.props.restrictDistance
            ? circleProps(region) : undefined}
          onPress={this.onMapPress.bind(this)}
          markers={[this.state.marker]}
          onMapReady={() => {
            this.map.animateToRegion(region, 1500);
          }}
          initialRegion={this.state.initialRegion}
          style={!this.props.searchDisabled ? styles.map : undefined}
          getRef={(map) => {
            this.map = map;
          }}
        />
        {!this.props.searchDisabled &&
        <GooglePlacesAutocomplete
          placeholder={strings.label_text_select_country_hint}
          minLength={2}
          autoFocus={false}
          returnKeyType={'search'}
          listViewDisplayed="auto"
          fetchDetails
          onPress={(data, details = null) => {
            this.onAutocompletePress(details);
          }}
          getDefaultValue={() => ''}
          query={{
            key: 'AIzaSyDsL-LeucaFuq26bdOQUmjOLGQ1Eu-ibdg',
          }}
          styles={autocompleteStyle}
          nearbyPlacesAPI="GooglePlacesSearch"
          GoogleReverseGeocodingQuery={{}}
          GooglePlacesSearchQuery={{ rankby: 'distance' }}
          debounce={200}
        />}
        <CurrentLocationButton
          onCurrentLocationPress={this.getPosition.bind(this)}
        />
        {this.renderConfirmButton()}
      </View>
    );
  }
}

AddLocation.propTypes = {
  onChangeUserLocation: PropTypes.func,
};


export default AddLocation;
