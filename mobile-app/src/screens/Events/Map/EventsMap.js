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
import {Map as MapView} from '../../../components/Map/Map';
import {DEFAULT_ZOOM} from "../../../shared/constants";
import {renderItem} from '../List/ListItem/ListItem';
import colors from '../../../config/colors';
import {toRadians} from "../../../shared/helpers";

const cancelId = 'cancelId';
const saveId = 'saveId';

export default class EventsMap extends Component {

    static navigatorStyle = styles.navigatorStyle;

    marked = new Map();


    constructor(props) {
        super(props);
        const {location, events} = props;

        const markers = events.map((event) => {
            return {
                id: event.id,
                latlng: event.place.location,
                status: event.status,
                isMarked: this.marked.has(event.id),
                item: event
            }
        });

        this.state = {
            markers,
            selectedItem: undefined
        };

        this.initialRegion = {
            latitude: location != null ? location.latitude : 35,
            longitude: location != null ? location.longitude : 49,
            latitudeDelta: DEFAULT_ZOOM,
            longitudeDelta: this.calculateZoom(location != null ? location.latitude : 35),
        };

        this.circle = {
            radius: 10000,
            borderColor: colors.$mainBlue,
            fillColor: 'rgba(0, 143, 223, 0.2)',
            center: {
                latitude: location != null ? location.latitude : 35,
                longitude: location != null ? location.longitude : 49,
            },
            borderWidth: 1
        };

        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    calculateZoom(latitude) {
        const zoom = Math.abs((10000 / (2 * 3.14 * Math.cos(latitude) * 6371000)) * 360) * 2;
        return  zoom;
    }

    componentDidUpdate() {

    }

    onCheckedChanged(checked, item) {
        if (checked) {
            this.marked.set(item.id, item)
        } else {
            this.marked.delete(item.id)
        }

        const markers = this.props.trashPoints.map((trashPoint) => {
            return {
                id: trashPoint.id,
                latlng: trashPoint.location,
                status: trashPoint.status,
                isMarked: this.marked.has(trashPoint.id),
                item: trashPoint
            }
        });
        this.setState(previousState => {
            return {
                ...previousState,
                markers
            };
        });

    };

    render() {

        const {selectedItem} = this.state;

        const checked = selectedItem ? this.marked.has(selectedItem.id) : undefined;

        return (
            <View style={styles.container}>
                <MapView
                    handleOnMarkerPress={this.handleOnMarkerPress.bind(this)}
                    markers={this.state.markers}
                    initialRegion={this.initialRegion}
                    region={this.initialRegion}
                    style={styles.map}
                    getRef={(map) => this.map = map}
                    circleProps={this.circle}/>
                {this.renderSelectedItem(selectedItem, checked)}
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