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
import strings from "../../../assets/strings";
import {renderItem} from '../Item/ListItem';
import {ADD_TRASH_POINTS} from "../../index";

import { Icons } from '../../../assets/images';

const cancelId = 'cancelId';
const saveId = 'saveId';

export default class AddTrashPointsMap extends Component {

    static navigatorStyle = styles.navigatorStyle;

    marked = new Map();

    static navigatorButtons = {
        leftButtons: [
            {
                icon: Icons.Back,
                id: cancelId,
            }
        ],
        rightButtons: [
            {
                title: strings.label_save,
                id: saveId,
                buttonColor: 'rgb(0, 143, 223)',
                buttonFontSize: 17,
                buttonFontFamily: 'Lato-Bold',
            },
        ]
    };

    constructor(props) {
        super(props);
        const {location, selectedTrashPoints, trashPoints} = props;

        selectedTrashPoints.forEach((trashPoint) => {
            this.marked.set(trashPoint.id, trashPoint)
        });

        const markers = trashPoints.map((trashPoint) => {
            return {
                id: trashPoint.id,
                latlng: trashPoint.location,
                status: trashPoint.status,
                isMarked: this.marked.has(trashPoint.id),
                item: trashPoint
            }
        });

        this.state = {
            markers,
            selectedItem: undefined
        };

        this.initialRegion = {
            latitude: this.props.location.latitude,
            longitude: this.props.location.longitude,
            latitudeDelta: DEFAULT_ZOOM,
            longitudeDelta: DEFAULT_ZOOM,
        };

        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidUpdate() {

    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            switch (event.id) {
                case cancelId: {
                    this.props.navigator.pop();
                    break;
                }
                case saveId: {
                    this.props.onMapTrashPointsSaved(this.marked);
                    this.props.navigator.pop();
                    break;
                }
            }
        }
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
                    getRef={(map) => this.map = map}/>
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