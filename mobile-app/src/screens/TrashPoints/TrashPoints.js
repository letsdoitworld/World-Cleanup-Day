import React, {Component} from 'react';
import {ActivityIndicator, LayoutAnimation, TextInput, UIManager, View} from 'react-native';

import {Map as MapView} from '../../components/Map';
import {DEFAULT_ZOOM, MIN_ZOOM} from '../../shared/constants';
import _ from 'lodash';
import {CREATE_MARKER, EVENTS_NAV_BAR, TRASH_POINT} from "../index";
import styles from "../Events/styles";
import FAB from 'react-native-fab';
import Icon from 'react-native-vector-icons/Feather';
import {debounce} from "../../shared/util";
import strings from "../../assets/strings";
import ImagePicker from 'react-native-image-crop-picker';
import {getCurrentPosition} from "../../shared/geo";
import PropTypes from 'prop-types';
import ImageService from "../../services/Image";
import Api from '../../api';
import Events from "../Events/Events";
import {autocompleteStyle} from "../AddLocation/AddLocation";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
//import styles from './styles';

const MODE = {
    list: 0,
    map: 1,
};

const searchId = 'searchId';
const DEFAULT_RADIUS_M = 10000;


class TrashPoints extends Component {

    constructor(props) {
        super(props);

        this.props.navigator.setStyle({
            navBarCustomView: EVENTS_NAV_BAR,
            statusBarColor: 'white',
            statusBarTextColorScheme: 'dark',
            navBarBackgroundColor: 'white',
            navBarCustomViewInitialProps: {
                index: MODE.map,
                handleIndexChange: this.onModeChanged.bind(this),
            },
        });

        const { mapTrashPoints, userCoord } = props;

        const region = {
            latitude: userCoord.latitude,
            longitude: userCoord.longitude,
            latitudeDelta: DEFAULT_ZOOM,
            longitudeDelta: DEFAULT_ZOOM,
        };

        this.state = {
            radius: DEFAULT_RADIUS_M,
            markers: undefined,
            mapTrashPoints,
            mode: MODE.map,
            isSearchFieldVisible: false,
            updateRegion: true,
            region,
            initialRegion: region
        };
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onModeChanged(index) {
        this.setState((previousState) => {
            return {
                ...previousState,
                mode: index
            };
        });
    }

    isSearchFieldVisible() {
        return this.state.isSearchFieldVisible
    }

    toggleSearchFieldVisibility() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState((previousState) => {
            return {isSearchFieldVisible: !this.isSearchFieldVisible()};
        });
        // if (!this.isSearchFieldVisible() && (this.query ? this.query.length > 0 : false)) {
        //     this.query = undefined;
        // if (this.list) {
        //     this.list.page = 0;
        // }
        // this.loadEvents(0);
        // }
    }

    static navigatorButtons = {
        rightButtons: [
            {
                icon: require('../../../src/assets/images/icSearchBlack24Px.png'),
                id: searchId,
            },
        ],

    };

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
        if (!this.props.datasetUUIDSelector) {
            this.props.onFetchDatasetUUIDAction();
        }
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.mapTrashPoints && this.props.mapTrashPoints
            && nextProps.mapTrashPoints.join('') === this.props.mapTrashPoints.join('')) {
            return
        }

        let listEvents = [];
      //  let markers = [];
        if (nextProps.mapTrashPoints) {
            // listEvents = mapEvents.filter(event => event.count === undefined);
            const markers = nextProps.mapTrashPoints.map((mapTrashPoint) => {
                return {
                    ...mapTrashPoint,
                    latlng: mapTrashPoint.location,
                };
            });

            this.setState((previousState) => {
                return {
                    ...previousState,
                    mapTrashPoints: nextProps.mapTrashPoints,
                    markers
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
                    trashPoint: marker
                }
            })
        } else {
            if (this.map) {

                const {latitude, longitude, latitudeDelta, longitudeDelta} = this.state.region;
                const northWest = {
                    latitude: this.adjustLatitude(latitude + latitudeDelta / 2),
                    longitude: this.adjustLongitude(longitude - longitudeDelta / 2),
                };
                const southEast = {
                    latitude: this.adjustLatitude(latitude - latitudeDelta / 2),
                    longitude: this.adjustLongitude(longitude + longitudeDelta / 2),
                };

                const cell = Api.trashPoints.calculateCell(northWest, southEast);
                const delta = Api.trashPoints.calculateDelta(northWest, southEast, this.state.region);
                if (this.state.region.latitudeDelta === MIN_ZOOM) {
                    return this.setState({
                        updateRegion: false
                    }, () => {
                        this.props.loadTrashPointsFromClusterAction(
                            cell,
                            marker.coordinates,
                            marker.id,
                            this.props.datasetUUIDSelector,
                            this.props.mapTrashPoints
                        );
                    });
                }
                const region = {
                    ...marker.latlng,
                    ...delta
                };
                this.map.animateToRegion(region, 300);
            }
        }
    };

    getMapObject = map => (this.map = map);

    adjustLongitude = n => {
        if (n < -180) {
            return 360 + n;
        }
        if (n > 180) {
            return n - 360;
        }
        return n;
    };
    adjustLatitude = n => {
        const signMultiplier = n > 0 ? 1 : -1;
        if (Math.abs(n) > 90) {
            return signMultiplier * 89.999;
        }

        return n;
    };

    handleOnRegionChangeComplete = center => {

        if (!this.state.updateRegion) {
            this.setState((previousState) => {
                return {
                    ...previousState,
                    updateRegion: true,
                    region: center
                };
            });
        }

        const {latitude, longitude, latitudeDelta, longitudeDelta} = center;
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
                        flex: 1
                    }}>
                    {this.renderContent()}
                    {this.renderSearchBox()}
                    </View>
                    <FAB
                        buttonColor="rgb(225, 18, 131)"
                        iconTextColor="white"
                        onClickAction={this.handleFabPress.bind(this)}
                        visible
                        iconTextComponent={<Icon name="plus"/>}
                    />
                </View>
                {this.renderProgress()}
            </View>
        );
    }

    renderContent() {
        const { userCoord } = this.props;

        const { selectedItem, mapTrashPoints, markers, region, initialRegion } = this.state;


        switch (this.state.mode) {
            case MODE.list: {
                return null;
            }
            case MODE.map: {
                return (
                    <MapView
                        style={{
                            marginTop: this.isSearchFieldVisible() ? 44 : 0
                        }}
                        handleOnMarkerPress={this.onMarkerPress.bind(this)}
                        onRegionChangeComplete={this.handleOnRegionChangeComplete.bind(this)}
                        markers={markers}
                        initialRegion={initialRegion}
                        region={region === initialRegion && this.state.updateRegion === false ? region : undefined}
                        getRef={this.getMapObject.bind(this)}/>
                );
            }
            default:
                return null;
        }
    }


    handleFabPress = async () => {


        const image = await ImagePicker.openCamera({
            compressImageQuality: 0.2,
            cropping: true,
            includeBase64: true
        });
        const {width, height, data, path } = image;
        const uri = path;
        const base64 = data;

        const thumbnailBase64 = await ImageService.getResizedImageBase64({
            uri,
            width,
            height
        });

        const { coords } = await getCurrentPosition({
            enableHighAccuracy: false,
            timeout: 10 * 1000,
            maximumAge: 60 * 1000
        });

        this.props.navigator.push({
            screen: CREATE_MARKER,
            title: strings.label_button_createTP_confirm_create,
            passProps: {
                photos: [{ uri, thumbnail: { base64: thumbnailBase64 },  base64}],
                coords,
            }
        });
    };

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
                                    longitude
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
    country: PropTypes.object,
    onFetchLocation: PropTypes.func,
    loadTrashPointsForMapAction: PropTypes.func,
};

export default TrashPoints;
