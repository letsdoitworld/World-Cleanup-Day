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

        const { location, onLoadMapEventsAction, mapTrashPoints, userCoord } = props;
        // let userLocation;
        // if (location === undefined || location === null) {
        //     // TODO fix me!! Random location?
        //     // alert(strings.label_no_location);
        //     // userLocation = {
        //     //     latitude: 48.8152937,
        //     //     longitude: 2.4597668
        //     // }
        // } else {
        //     userLocation = location;
        // }

        this.state = {
            radius: DEFAULT_RADIUS_M,
            markers: undefined,
            mapTrashPoints,
           // userLocation,
            mode: MODE.map,
            isSearchFieldVisible: false,
            updateRegion: true,
            region: {
                latitude: userCoord.latitude,
                longitude: userCoord.longitude,
                latitudeDelta: DEFAULT_ZOOM,
                longitudeDelta: DEFAULT_ZOOM,
            }
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

    // componentDidMount() {
    //     setTimeout(() => {
    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 this.getLocation(position);
    //             },
    //             error => console.log('Error', error),
    //             { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    //         );
    //     }, 1000);
  //  }

    // getLocation = position => {
    //     const { onFetchLocation } = this.props;
    //     onFetchLocation({
    //         lat: position.coords.latitude,
    //         long: position.coords.longitude,
    //     });
    // };

    // shouldComponentUpdate(nextProps) {
    //     const locationChanged = this.props.userLocation !== nextProps.userLocation;
    //     return (
    //         nextProps.activeScreen === SCREENS.HOME ||
    //         nextProps.activeScreen === SCREENS.PUBLIC_HOME ||
    //         locationChanged
    //     );
    // }

    componentDidMount() {
        if (!this.props.datasetUUIDSelector) {
            this.props.onFetchDatasetUUIDAction();
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState((previousState) => {
            return {
                ...previousState,
                mapTrashPoints: nextProps.mapTrashPoints,
            };
        });
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
                    ...delta,
                    ...marker.latlng,
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
        } else {
            this.setState((previousState) => {
                return {
                    ...previousState,
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

        // return (
        //     <View style={{flex: 1}}>
        //         <StatusBar translucent={false} barStyle="default"/>
        //         <MapView
        //             onRegionChangeComplete={this.handleOnRegionChangeComplete}
        //             markers={markers}
        //             initialRegion={initialRegion}
        //             handleOnMarkerPress={this.onPressMarker}
        //             getRef={this.getMapObject}/>
        //     </View>
        // );

        return (
            <View style={[styles.containerContent]}>
                <View style={[styles.mainContentContainer, styles.containerContent, styles.vertical]}>
                    {this.renderSearchBox()}
                    {this.renderContent()}
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

        const { selectedItem, mapTrashPoints, region } = this.state;
        // const {markers, initialRegion} = this.props;

        let listEvents = [];
        let markers = [];
        if (mapTrashPoints) {
           // listEvents = mapEvents.filter(event => event.count === undefined);
            markers = mapTrashPoints.map((mapTrashPoint) => {
                return {
                    ...mapTrashPoint,
                    latlng: mapTrashPoint.location,
                };
            });
        }

        switch (this.state.mode) {
            case MODE.list: {
                return null;
            }
            case MODE.map: {
                return (
                    <MapView
                        handleOnMarkerPress={this.onMarkerPress.bind(this)}
                        onRegionChangeComplete={this.handleOnRegionChangeComplete.bind(this)}
                        markers={markers}
                        initialRegion={region}
                        region={region}
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
//
// const mapStateToProps = state => {
// //  console.log(state)
// //  const mapMarkers = trashpileSelectors.markersSelector(state);
// //   const mapMarkers = markersSelector(state);
// //   const userMarker = locationSelectors.userMarkerSelector(state);
// //   const locationActive = locationSelectors.hasLocationActive(state);
// //
// //   const markers = locationActive ? [...mapMarkers, userMarker] : mapMarkers;
//     return {
//         // markers,
//         // initialRegion: locationSelectors.initialRegionSelector(state),
//         // activeScreen: appSelectors.getActiveScreen(state),
//         // userLocation: locationSelectors.userLocationSelector(state),
//         // delta: trashpileSelectors.getLastDeltaValue(state),
//     };
// };
//
// const mapDispatchToProps = dispatch => {
//     return {
//         // fetchAllMarkers(northWestViewPort, southEastViewPort, delta) {
//         //   dispatch(
//         //     trashpileOperations.fetchAllMarkers(
//         //       northWestViewPort,
//         //       southEastViewPort,
//         //       delta,
//         //     ),
//         //   );
//         // },
//         // fetchClusterTrashpoints(cellSize, coordinates, clusterId) {
//         //   dispatch(
//         //     trashpileOperations.fetchClusterTrashpoints({
//         //       cellSize,
//         //       coordinates,
//         //       clusterId,
//         //     }),
//         //   );
//         // },
//     };
// };
//
// // export default connect(mapStateToProps, mapDispatchToProps)(TrashPoints);
// export default TrashPoints;
//
// // export default compose(
// //   connect(mapStateToProps, mapDispatchToProps),
// //   withNavigationHelpers(),
// // )(Home);

export default TrashPoints;
