import React, {Component} from 'react';
import {
    View,
    TouchableOpacity,
    Text, ScrollView,
    TextInput,
    Image,
    Dimensions,
    LayoutAnimation,
    UIManager,
    KeyboardAvoidingView
} from 'react-native';
import styles from './styles'
import strings from '../../assets/strings'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Map} from '../../components/Map/Map';
import {DEFAULT_ZOOM} from "../../shared/constants";
import {MARKER_STATUS_IMAGES} from "../../components/Map/Marker";
import {connect} from "react-redux";

const cancelId = 'cancelId';

const autocompleteStyle = {
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
                icon: require('../../../src/assets/images/ic_back.png'),
                id: cancelId,
            }
        ]

    };

    constructor(props) {
        super(props);
        const {initialLocation} = props;
        if (initialLocation !== undefined) {
            this.state = {
                marker: undefined,
                region: null,
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

    // componentDidMount() {
    //     if (this.state.initialRegion === undefined) {
    //         this.getCurrentPosition();
    //     }
    // }

    componentWillReceiveProps(nextProps) {
        if (this.state.initialRegion === undefined && nextProps.auth.get('token') !== undefined) {
            this.getCurrentPosition();
        }
    }

    getCurrentPosition() {
        try {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const {latitude, longitude} = position.coords;
                    this.setState(previousState => {
                        return {
                            initialRegion: {
                                latitude,
                                longitude,
                                latitudeDelta: DEFAULT_ZOOM,
                                longitudeDelta: DEFAULT_ZOOM,
                            }
                        };
                    });
                },
                (error) => {
                    //todo: some default location
                    this.setState(previousState => {
                        return {
                            initialRegion: {
                                latitude: 48.8152937,
                                longitude: 2.4597668,
                                latitudeDelta: DEFAULT_ZOOM,
                                longitudeDelta: DEFAULT_ZOOM,
                            }
                        };
                    });
                }
            );
        } catch(e) {
            //todo: some default location
            this.setState(previousState => {
                return {
                    initialRegion: {
                        latitude: 48.8152937,
                        longitude: 2.4597668,
                        latitudeDelta: DEFAULT_ZOOM,
                        longitudeDelta: DEFAULT_ZOOM,
                    }
                };
            });
        }
    };

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            switch (event.id) {
                case cancelId: {
                    this.back();
                    break;
                }
            }
        }
    }

    onConfirmPress = () => {
        const {latitude, longitude} = this.state.marker.latlng;
        this.back({
            latitude,
            longitude,
        })
    };

    back(selectedLocation = undefined) {
        this.props.onLocationSelected(selectedLocation);
        this.props.navigator.pop({
            animated: true,
            animationType: 'slide_out',
        });
    }

    onMapPress = (e) => {
        const coordinate = e.nativeEvent.coordinate;
        const longitude = coordinate.longitude;
        const latitude = coordinate.latitude;

        this.updateMarkerInState({
            latitude,
            longitude
        })
    };

    updateMarkerInState(latlng) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState(previousState => {
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
                }
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
                    initialRegion={this.state.initialRegion}
                    style={styles.map}
                    getRef={(map) => {
                        this.map = map
                    }}/>
                <GooglePlacesAutocomplete
                    placeholder={strings.label_text_select_country_hint}
                    minLength={2}
                    autoFocus={false}
                    returnKeyType={'search'}
                    listViewDisplayed='auto'
                    fetchDetails={true}
                    renderDescription={row => row.description}
                    onPress={(data, details = null) => {
                        const latitude = details.geometry.location.lat;
                        const longitude = details.geometry.location.lng;
                        this.updateMarkerInState({latitude, longitude})
                    }}
                    getDefaultValue={() => ''}
                    query={{
                        // available options: https://developers.google.com/places/web-service/autocomplete
                        key: 'AIzaSyDawYuRZ7A9f3xlYXx50-88tvSKi5ouPm8',
                        language: 'en', // language of the results
                        types: '(cities)' // default: 'geocode'
                    }}
                    styles={autocompleteStyle}
                    nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                    GoogleReverseGeocodingQuery={{
                        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                    }}
                    GooglePlacesSearchQuery={{
                        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                        rankby: 'distance',
                        types: 'food'
                    }}
                    filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                    debounce={200}/>
                {this.renderConfirmButton()}
            </View>
        );
    }

    renderConfirmButton() {
        if (this.state.marker !== undefined) {
            return (
                <TouchableOpacity
                    onPress={this.onConfirmPress.bind(this)}
                    style={styles.confirmButton}>
                    <Text style={styles.confirmButtonText}>
                        {strings.label_confirm_location}
                    </Text>
                </TouchableOpacity>
            );
        } else {
            return null
        }
    }

}

const mapStateToProps = (state) => ({
    auth: state.get('auth'),
});

export default connect(mapStateToProps)(AddLocation)