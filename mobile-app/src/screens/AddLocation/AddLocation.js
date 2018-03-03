import React, {Component} from 'react';
import {View, TouchableOpacity, Text, ScrollView, TextInput, Image} from 'react-native';
import styles from './styles'
import strings from '../../assets/strings'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
//const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
//const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};


import {Map} from '../../components/Map/Map';
import dimens from "../../config/dimens";
import {DEFAULT_ZOOM} from "../../shared/constants";
import {MARKER_STATUS_IMAGES} from "../../components/Map/Marker";

const cancelId = 'cancelId';

const autocompleteStyle = {
    listView: styles.searchListView,
    container: styles.searchContainer,
    textInputContainer: styles.searchTextInputContainer,
    textInput: styles.searchTextInput,
    description: styles.searchDescription,
};

export default class AddLocation extends Component {

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
        // const {initialLocation} = this.props;
        // this.state = {
        //     initialRegion: {
        //         latitude: initialLocation.latitude,
        //         longitude: initialLocation.longitude,
        //         latitudeDelta: DEFAULT_ZOOM,
        //         longitudeDelta: DEFAULT_ZOOM,
        //     },
        // };

        this.state = {
            marker: undefined,
        };



        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            switch (event.id) {
                case cancelId: {

                    break;
                }
            }
        }
    }

    onMapPress = (e) => {
        const coordinate = e.nativeEvent.coordinate;
        const longitude = coordinate.longitude;
        const latitude = coordinate.latitude;

        // this.setState(previousState => {
        //     return {
        //         marker: {
        //             latlng: {
        //                 latitude,
        //                 longitude
        //             },
        //             status: MARKER_STATUS_IMAGES.cleaned,
        //             id: 1,
        //         },
        //     };
        // });

        this.updateMarkerInState({
            latitude,
            longitude
        })
    };

    updateMarkerInState(latlng) {
        this.setState(previousState => {
            return {
                marker: {
                    latlng,
                    status: MARKER_STATUS_IMAGES.cleaned,
                    id: 1,
                },
            };
        });
    }

    render() {

        return (
            <View style={{
                flex: 1,
            }}>
                <Map
                    region={{
                        latitude: this.state.marker.latlng.latitude,
                        longitude: this.state.marker.latlng.longitude,
                        latitudeDelta: DEFAULT_ZOOM,
                        longitudeDelta: DEFAULT_ZOOM,
                    }}
                    onPress={this.onMapPress.bind(this)}
                    markers={[this.state.marker]}
                  //  initialRegion={this.state.initialRegion}
                    style={{
                        position: 'absolute',
                    }}
                    //  onRegionChangeComplete={this.handleOnRegionChangeComplete}
                    // circleProps={this.getCircleProps(initialRegion)}
                    getRef={map => (this.map = map)}
                    // onRegionChange={this.handleOnRegionChange}
                />

                <GooglePlacesAutocomplete
                    placeholder={strings.label_text_select_country_hint}
                    minLength={2} // minimum length of text to search
                    autoFocus={false}
                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                    listViewDisplayed='auto'    // true/false/undefined
                    fetchDetails={true}
                    renderDescription={row => row.description} // custom description render
                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true

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
                    debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                />

            </View>
        );
    }

}