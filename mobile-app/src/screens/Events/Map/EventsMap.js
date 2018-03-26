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
import {Map as MapView} from '../../../components/Map/Map';
import {DEFAULT_ZOOM} from "../../../shared/constants";
import {renderItem} from '../List/ListItem/ListItem';
import colors from '../../../config/colors';
import {toRadians} from "../../../shared/helpers";
import Button from "../../../components/Button/Button";
import { HorizontalEvent } from "../../../components";

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
            userLocation = {
                latitude: 48.8152937,
                longitude: 2.4597668
            }
        } else {
            userLocation = location
        }

        this.state = {
            markers: undefined,
            mapEvents,
            userLocation,
            radius: DEFAULT_RADIUS_M,
            selectedItem: undefined
        };

        this.initialRegion = {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: DEFAULT_ZOOM,
            longitudeDelta: this.calculateZoom(userLocation.latitude),
        };

        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    calculateZoom(latitude) {
        const zoom = Math.abs((this.state.radius / (2 * 3.14 * Math.cos(latitude) * 63710000)) * 360) * 4;
        return zoom;
    }

    componentDidMount() {
        this.props.onLoadMapEventsAction({location: this.state.userLocation, radius: (this.state.radius / 1000)})
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

    render() {

        const {selectedItem, radius} = this.state;
        let markers;
        if (this.props.mapEvents !== undefined) {
            markers = this.props.mapEvents.map((event) => {
                return {
                    id: event.id,
                    latlng: event.location,
                    item: event
                }
            });
        }

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

        return (
            <View style={styles.container}>
                <MapView
                handleOnMarkerPress={this.handleOnMarkerPress.bind(this)}
                //markers={this.state.markers}
                markers={markers}
                initialRegion={this.initialRegion}
                region={this.regionWIthMarkers}
                style={styles.map}
                getRef={(map) => this.map = map}
                circleProps={this.circle}>

                </MapView>
                {/*{this.renderSelectedItem(selectedItem, checked)}*/}

                {/*<Button style={styles.buttonStyle}*/}
                {/*text={"Load"}*/}
                {/*onPress={() => this.loadMapEventsWithMoreRadius()}/>*/}

                <FlatList
                    style={styles.list}
                    contentContainerStyle={styles.listContainer}
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