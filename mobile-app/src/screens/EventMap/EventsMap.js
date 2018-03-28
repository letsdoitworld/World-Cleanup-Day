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
    FlatList,
    KeyboardAvoidingView
} from 'react-native';
import styles from './styles'
 import {Map as MapView} from '../../components/Map/Map';
 import {DEFAULT_ZOOM} from "../../shared/constants";
import {renderItem} from '../Events/List/ListItem/ListItem';
import colors from '../../config/colors';
import {toRadians} from "../../shared/helpers";
import Button from "../../components/Button/Button";
 import { HorizontalEvent } from "../../components/index";

const cancelId = 'cancelId';
const saveId = 'saveId';
const DEFAULT_RADIUS_M = 10000;

export default class EventsMap extends Component {

    static navigatorStyle = styles.navigatorStyle;

    marked = new Map();


    constructor(props) {
        super(props);
        const {location, onLoadMapEventsAction, mapEvents} = props;
         let userLocation;
        if (location === undefined || location === null) {
            //TODO fix me!! Random location?
            //alert(strings.label_no_location);
            // userLocation = {
            //     latitude: 48.8152937,
            //     longitude: 2.4597668
            // }
        } else {
            userLocation = location
        }

        this.state = {
            markers: undefined,
            mapEvents,
            userLocation,
            radius: DEFAULT_RADIUS_M,
            selectedItem: undefined,
            updateRegion: true,
        };

        this.initialRegion = {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: DEFAULT_ZOOM,
            longitudeDelta: DEFAULT_ZOOM,
        };

        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    calculateZoom(latitude) {
        const zoom = Math.abs((this.state.radius / (2 * 3.14 * Math.cos(latitude) * 63710000)) * 360) * 4;
        return zoom;
    }

    componentDidMount() {
        if (!this.props.datasetUUIDSelector) {
            this.props.onFetchDatasetUUIDAction();
        }
    }

    onCheckedChanged(checked, item) {
        if (checked) {
            this.marked.set(item.id, item)
        } else {
            this.marked.delete(item.id)
        }

        const markers = this.props.mapEvents.map((mapEvents) => {
            return {
                id: mapEvents.id,
                latlng: mapEvents.location,
                item: mapEvents
            }
        });
        this.setState(previousState => {
            return {
                ...previousState,
                markers
            };
        });

    };

    loadMapEventsWithMoreRadius() {
        const newRadius = this.state.radius + DEFAULT_RADIUS_M;
        this.props.onLoadMapEventsAction({location: this.state.userLocation, radius: (newRadius / 1000)});
        this.setState(previousState => {
            return {
                radius: newRadius,
            }
        })
    }

    handleOnRegionChangeComplete = center => {
        if (!this.state.updateRegion) {
            return this.setState({ updateRegion: true });
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

        const { latitude, longitude, latitudeDelta, longitudeDelta } = center;
        const northWest = {
            latitude: adjustLatitude(latitude + latitudeDelta / 2),
            longitude: adjustLongitude(longitude - longitudeDelta / 2),
        };
        const southEast = {
            latitude: adjustLatitude(latitude - latitudeDelta / 2),
            longitude: adjustLongitude(longitude + longitudeDelta / 2),
        };

        const delta = {
            latitudeDelta,
            longitudeDelta,
        };

        if (this.props.datasetUUIDSelector) {
            this.props.onLoadMapEventsAction({
                datasetId: this.props.datasetUUIDSelector,
                viewPortLeftTopCoordinate: northWest,
                viewPortRightBottomCoordinate: southEast,
                delta: delta
            });
        }
    };


    keyExtractor = (item, index) => item.id.toString();

    renderItem(event) {
        console.log("renderItem", event);
        return (
            <HorizontalEvent
                img={event.photo}
                title={event.name}
                coordinator={event.coordinator}
                date={event.createDate}
                maxParticipants={event.maxPeopleAmount}
                participants={event.peopleAmount}/>
        );
    }

    renderHeader = () => {
            return (<View style={styles.emptyStyle}/>)
    };

    render() {

        const {selectedItem, radius} = this.state;
        // let markers;
        // if (this.props.mapEvents !== undefined) {
        //     markers = this.props.mapEvents.map((event) => {
        //         return {
        //             id: event.id,
        //             latlng: event.location,
        //             item: event
        //         }
        //     });
        // }


        this.circle = {
            radius: radius,
            borderColor: colors.$mainBlue,
            fillColor: 'rgba(0, 143, 223, 0.2)',
            center: {
                latitude: this.state.userLocation.latitude,
                longitude: this.state.userLocation.longitude,
            },
            borderWidth: 1
        };

        this.regionWIthMarkers = {
            ...this.initialRegion,
            longitudeDelta: this.calculateZoom(this.state.userLocation.latitude),
        };

        const checked = selectedItem ? this.marked.has(selectedItem.id) : undefined;
        console.log("Render", this.props.mapEvents);
        let markers = [];
        if (this.props.mapEvents) {
            markers = this.props.mapEvents;
        }

        return (
            <View style={styles.container}>
                <MapView
                onRegionChangeComplete={this.handleOnRegionChangeComplete}
                markers={markers}
                initialRegion={this.initialRegion}
                style={styles.map}
                handleOnMarkerPress={this.handleOnMarkerPress.bind(this)}
                getRef={(map) => this.map = map}>

                </MapView>
                {/*{this.renderSelectedItem(selectedItem, checked)}*/}

                {/*<Button style={styles.buttonStyle}*/}
                {/*text={"Load"}*/}
                {/*onPress={() => this.loadMapEventsWithMoreRadius()}/>*/}

                <FlatList
                    style={styles.list}
                    contentContainerStyle={styles.listContainer}
                    ListHeaderComponent={this.renderHeader.bind(this)}
                    data={this.props.mapEvents}
                    horizontal
                    keyExtractor={this.keyExtractor.bind(this)}
                    renderItem={({ item }) =>this.renderItem(item)}
                />

            </View>
        );
    }

    handleOnMarkerPress(marker) {
        this.setState(previousState => {
            return {
                ...previousState,
                selectedItem: marker.item
            };
        });
    }

    renderSelectedItem(selectedItem, checked) {

        if (checked === undefined) return null;

        if (selectedItem) {

            const onPress = () => {

            };

            return renderItem(
                selectedItem,
                checked,
                styles.trashPointItem,
                onPress,
                this.onCheckedChanged.bind(this)
            )
        } else {
            return null
        }
    }

}