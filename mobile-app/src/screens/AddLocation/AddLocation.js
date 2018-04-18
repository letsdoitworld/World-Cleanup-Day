import React, {Component} from 'react';
import {LayoutAnimation, Text, TouchableOpacity, UIManager, View} from 'react-native';
import styles from './styles';
import strings from '../../assets/strings';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Map} from '../../components';
import {DEFAULT_ZOOM} from '../../shared/constants';
import {MARKER_STATUS_IMAGES} from '../../components/Map/Marker';
import {connect} from 'react-redux';
import {IGPSCoordinates} from 'NativeModules';
import {geocodeCoordinates} from '../../shared/geo';

import {Icons} from '../../assets/images';

const cancelId = 'cancelId';

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
    console.warn("initialLocation prps", initialLocation);
    if (initialLocation !== undefined) {
      this.state = {
        marker: undefined,
        initialRegion: {
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: DEFAULT_ZOOM,
          longitudeDelta: DEFAULT_ZOOM,
        },
      };
    } else {
      this.state = {
        marker: undefined,
        region: null,
        initialRegion: undefined,
      };
    }

    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
      console.warn("initialRegion", this.state.initialRegion);
    if (this.state.initialRegion === undefined) {
      this.getCurrentPosition();
    }
  }

  getCurrentPosition() {
    try {
      navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  this.setState((previousState) => {
                    return {
                      initialRegion: {
                        latitude,
                        longitude,
                        latitudeDelta: DEFAULT_ZOOM,
                        longitudeDelta: DEFAULT_ZOOM,
                      },
                    };
                  });
                },
                (error) => {
                  if (error.code === 1) {
                    alert(strings.label_error_location_text);
                  }
                },
            );
    } catch (error) {
      alert(JSON.stringify(error));
    }
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
        case cancelId: {
          this.props.navigator.pop();
          break;
        }
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
    const coordinate = e.nativeEvent.coordinate;
    const longitude = coordinate.longitude;
    const latitude = coordinate.latitude;

    this.updateMarkerInState({
      latitude,
      longitude,
    });
  };

  updateMarkerInState(latlng) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState((previousState) => {
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

  render() {
    return (
      <View style={styles.container}>
        <Map
          region={this.state.region}
          onPress={this.onMapPress.bind(this)}
          markers={[this.state.marker]}
          onMapReady={() => {
              this.map.animateToRegion(this.state.initialRegion, 1500);
          }}
          initialRegion={this.state.initialRegion}
          style={styles.map}
          getRef={(map) => {
            this.map = map;
          }}
        />
        <GooglePlacesAutocomplete
          placeholder={strings.label_text_select_country_hint}
          minLength={2}
          autoFocus={false}
          returnKeyType={'search'}
          listViewDisplayed="auto"
          fetchDetails
          // renderDescription={row => row.description}
          onPress={(data, details = null) => {
            const latitude = details.geometry.location.lat;
            const longitude = details.geometry.location.lng;
            this.updateMarkerInState({ latitude, longitude });
          }}
          getDefaultValue={() => ''}
          query={{
            key: 'AIzaSyDsL-LeucaFuq26bdOQUmjOLGQ1Eu-ibdg',
          }}
          styles={autocompleteStyle}
          nearbyPlacesAPI="GooglePlacesSearch"
          GoogleReverseGeocodingQuery={{ }}
          GooglePlacesSearchQuery={{ rankby: 'distance' }}
          debounce={200}
        />
        {this.renderConfirmButton()}
      </View>
    );
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

}

const mapStateToProps = state => ({
  auth: state.get('auth'),
});

export default connect(mapStateToProps)(AddLocation);
