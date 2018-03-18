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
import {Map} from '../../../components/Map/Map';
import {DEFAULT_ZOOM} from "../../../shared/constants";
import strings from "../../../assets/strings";
import ImmutableComponent from "../../../components/InputFields/ImmutableComponent";

const cancelId = 'cancelId';
const saveId = 'saveId';

export default class AddTrashPointsMap extends Component {

    marked = new Map();

    static navigatorStyle = styles.navigatorStyle;

    static navigatorButtons = {
        leftButtons: [
            {
                icon: require('../../../../src/assets/images/ic_back.png'),
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
        const {location, marked, trashPoints} = props;

        const markers = trashPoints.map((trashPoint)=> {
            return {
                id: trashPoint.id,
                latlng: trashPoint.location,
                status: trashPoint.status
            }
        });

        this.state = {
            markers: markers,
            //  region: null,
            initialRegion: {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: DEFAULT_ZOOM,
                longitudeDelta: DEFAULT_ZOOM,
            },
        };


        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            switch (event.id) {
                case cancelId: {
                    this.props.navigator.pop();
                    break;
                }
                case saveId: {

                    break;
                }
            }
        }
    }

    onMapPress = (e) => {
        const coordinate = e.nativeEvent.coordinate;
        const longitude = coordinate.longitude;
        const latitude = coordinate.latitude;

        // this.updateMarkerInState({
        //     latitude,
        //     longitude
        // })
    };

    render() {
        return (
            <View style={styles.container}>
                <Map
                    // region={this.state.region}
                    // onPress={this.onMapPress.bind(this)}
                    markers={this.state.markers}
                    initialRegion={this.state.initialRegion}
                    style={styles.map}
                    getRef={(map) => this.map = map}/>
            </View>
        );
    }

}