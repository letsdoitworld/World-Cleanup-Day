import React, {Component} from 'react';
import {View, TouchableOpacity, Text, ScrollView, TextInput, Image} from 'react-native';
import styles from './styles'
import strings from '../../assets/strings'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};


import { Map } from '../../components/Map/Map';



export default class AddLocation extends Component {

    static navigatorStyle = styles.navigatorStyle;
    // constructor(props) {
    //     super(props);
    //     this.state = {text: "Type short name of event"}
    // }

    render() {
        return (
            <View style={{
                backgroundColor: 'red',
                justifyContent: 'column'
            }}>

                <GooglePlacesAutocomplete
                    placeholder='Search'
                    minLength={2} // minimum length of text to search
                    autoFocus={false}
                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                    listViewDisplayed='auto'    // true/false/undefined
                    fetchDetails={true}
                    renderDescription={row => row.description} // custom description render
                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                        console.log(data, details);
                    }}

                    getDefaultValue={() => ''}

                    query={{
                        // available options: https://developers.google.com/places/web-service/autocomplete
                        key: 'AIzaSyDawYuRZ7A9f3xlYXx50-88tvSKi5ouPm8',
                        language: 'en', // language of the results
                        types: '(cities)' // default: 'geocode'
                    }}

                    styles={{
                        textInputContainer: {
                            width: '100%'
                        },
                        description: {
                            fontWeight: 'bold'
                        },
                        predefinedPlacesDescription: {
                            color: '#1faadb'
                        }
                    }}

                    currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                    currentLocationLabel="Current location"
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
                    predefinedPlaces={[homePlace, workPlace]}

                    debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                    renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
                    renderRightButton={() => <Text>Custom text after the input</Text>}
                />
                );

                <Map
                    initialRegion={initialRegion}
                    onRegionChangeComplete={this.handleOnRegionChangeComplete}
                    circleProps={this.getCircleProps(initialRegion)}
                    getRef={map => (this.map = map)}
                    onRegionChange={this.handleOnRegionChange}
                />

            </View>
        );
    }

}