import React, {Component} from 'react';
import {
    LayoutAnimation,
    StatusBar,
    View,
    TextInput,
    Alert,
    UIManager, ActivityIndicator
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import {Map as MapView} from '../../components/Map/Map';

import {
    operations as trashpileOperations,
} from '../../reducers/trashpile/operations';
import {
    selectors as trashpileSelectors,
    markersSelector
} from '../../reducers/trashpile/selectors'
import {selectors as locationSelectors} from '../../reducers/location/selectors';
import {selectors as appSelectors} from '../../reducers/app/selectors';
import {
    DEFAULT_ZOOM,
    DELTA_HASH,
    GRID_HASH,
    MIN_ZOOM,
    SCREENS
} from '../../shared/constants';
import _ from 'lodash';
import {fetchAllMarkers} from "../../reducers/trashpile/operations";
import {ADD_TRASH_POINTS, CREATE_EVENT, CREATE_MARKER, EVENTS_NAV_BAR} from "../index";
import styles from "../Events/styles";
import FAB from 'react-native-fab';
import Icon from 'react-native-vector-icons/Feather';
import {debounce} from "../../shared/util";
import strings from "../../assets/strings";
import ImagePicker from 'react-native-image-crop-picker';
import ImageService from "../../services/Image";
import {getCurrentPosition} from "../../shared/geo";

const MODE = {
    list: 0,
    map: 1,
};

const searchId = 'searchId';

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

        this.state = {
            mode: MODE.map,
            isSearchFieldVisible: false,
            updateRegion: true,
        };
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onModeChanged(index) {
        this.setState((previousState) => {
            return {mode: index};
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

    // shouldComponentUpdate(nextProps) {
    //     const locationChanged = this.props.userLocation !== nextProps.userLocation;
    //     return (
    //         nextProps.activeScreen === SCREENS.HOME ||
    //         nextProps.activeScreen === SCREENS.PUBLIC_HOME ||
    //         locationChanged
    //     );
    // }

    onPressMarker = event => {
        const marker = this.props.markers.find(
            marker => marker.id === event.nativeEvent.id,
        );

        if (!marker.isTrashpile) {
            return;
        }

        if (marker && !marker.count) {
            this.props.navigation.navigate('Details', {
                markerId: event.nativeEvent.id,
                latlng: marker.latlng,
            });
        } else {
            if (this.map && _.has(this.props, 'delta.latitudeDelta')) {
                if (this.props.delta.latitudeDelta === MIN_ZOOM) {
                    return this.setState({
                        updateRegion: false
                    }, () => {
                        this.props.fetchClusterTrashpoints(
                            this.props.delta.cellSize,
                            marker.coordinates,
                            marker.id
                        );
                    });
                }
                const region = {
                    ...this.props.delta,
                    ...marker.latlng,
                };
                this.map.animateToRegion(region, 100);
            }
        }
    };

    getMapObject = map => (this.map = map);

    handleOnRegionChangeComplete = center => {
        if (!this.state.updateRegion) {
            return this.setState({updateRegion: true});
        }
        const adjustLongitude = n => {
            if (n < -180) {
                return 360 + n;
            }
            if (n > 180) {
                return n - 360;
            }
            return n;
        };
        const adjustLatitude = n => {
            const signMultiplier = n > 0 ? 1 : -1;
            if (Math.abs(n) > 90) {
                return signMultiplier * 89.999;
            }

            return n;
        };

        const {latitude, longitude, latitudeDelta, longitudeDelta} = center;
        const northWest = {
            latitude: adjustLatitude(latitude + latitudeDelta / 2),
            longitude: adjustLongitude(longitude - longitudeDelta / 2),
        };
        const southEast = {
            latitude: adjustLatitude(latitude - latitudeDelta / 2),
            longitude: adjustLongitude(longitude + longitudeDelta / 2),
        };

        // this.props.fetchAllMarkers(northWest, southEast, {
        //   latitudeDelta,
        //   longitudeDelta,
        // });
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

        const {markers, initialRegion} = this.props;

        switch (this.state.mode) {
            case MODE.list: {
                return null;
            }
            case MODE.map: {
                return (
                    <MapView
                        onRegionChangeComplete={this.handleOnRegionChangeComplete}
                        markers={markers}
                        initialRegion={initialRegion}
                        handleOnMarkerPress={this.onPressMarker}
                        getRef={this.getMapObject}/>
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
        const uri = path.substring('file://'.length);
        //
        // const thumbnailBase64 = await ImageService.getResizedImageBase64({
        //     uri,
        //     width,
        //     height
        // });
        //
        // console.warn(thumbnailBase64)

        const coords = await getCurrentPosition({
            enableHighAccuracy: false,
            timeout: 10 * 1000,
            maximumAge: 60 * 1000
        });

        this.props.navigator.push({
            screen: CREATE_MARKER,
           // title: strings.label_add_trashPoints,
            passProps: {
                photos: [{ uri, thumbnail: { base64: data },  base64: data}],
                coords,
            }
        });
      //  this.props.navigation.push('CreateMarker')
       // const { navigation, userLocation } = this.props;




        // const {isAuthenticated, isPrivateProfile} = this.props;
        //
        // if (isAuthenticated) {
        //     if(isPrivateProfile) {
        //         Alert.alert(
        //             'Update your privacy settings!',
        //             'Your profile should be public\n' +
        //             'in order to post event.',
        //             [
        //                 {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        //                 {text: 'Settings', onPress: this.handleSettingsPress},
        //             ],
        //         );
        //
        //         return;
        //     }
        //     this.props.navigator.showModal({
        //         screen: CREATE_EVENT,
        //         title: strings.label_create_events_step_one
        //     });
        // } else {
        //     Alert.alert(
        //         'Oh no!',
        //         'You need to be a registrated user\n' +
        //         'in order to create events.',
        //         [
        //             {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        //             {text: 'Register', onPress: this.handleLogInPress},
        //         ],
        //     )
        // }

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

const mapStateToProps = state => {
//  console.log(state)
//  const mapMarkers = trashpileSelectors.markersSelector(state);
//   const mapMarkers = markersSelector(state);
//   const userMarker = locationSelectors.userMarkerSelector(state);
//   const locationActive = locationSelectors.hasLocationActive(state);
//
//   const markers = locationActive ? [...mapMarkers, userMarker] : mapMarkers;
    return {
        // markers,
        // initialRegion: locationSelectors.initialRegionSelector(state),
        // activeScreen: appSelectors.getActiveScreen(state),
        // userLocation: locationSelectors.userLocationSelector(state),
        // delta: trashpileSelectors.getLastDeltaValue(state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // fetchAllMarkers(northWestViewPort, southEastViewPort, delta) {
        //   dispatch(
        //     trashpileOperations.fetchAllMarkers(
        //       northWestViewPort,
        //       southEastViewPort,
        //       delta,
        //     ),
        //   );
        // },
        // fetchClusterTrashpoints(cellSize, coordinates, clusterId) {
        //   dispatch(
        //     trashpileOperations.fetchClusterTrashpoints({
        //       cellSize,
        //       coordinates,
        //       clusterId,
        //     }),
        //   );
        // },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TrashPoints);

// export default compose(
//   connect(mapStateToProps, mapDispatchToProps),
//   withNavigationHelpers(),
// )(Home);
