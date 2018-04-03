import React, {Component} from 'react';
import {Text, View} from 'react-native';

import MapView from 'react-native-maps';

import styles from './styles';

export const STATUS_IMAGES = {
    cleaned: require('./images/status/icInactiveCleanedTrashpointMap.png'),
    outdated: require('./images/status/icInactiveInactiveTrashpointMap.png'),
    regular: require('./images/status/icInactiveRegularTrashpointMap.png'),
    urgent: require('./images/status/icInactiveToxicTrashpointMap.png')
};

export const SELECTED_STATUS_IMAGES = {
    cleaned: require('./images/status/icActiveCleanedTrashpointMap.png'),
    outdated: require('./images/status/icActiveInactiveTrashpointMap.png'),
    regular: require('./images/status/icActiveRegularTrashpointMap.png'),
    urgent: require('./images/status/icActiveToxicTrashpointMap.png')
};

const TRASHPILE_MARKER_OFFSET = {
    x: 4,
    y: -15,
};

const MARKER_OFFSET = {
    x: 0,
    y: 0,
};

export default class Marker extends Component {

    render() {


        const {marker, onMarkerPress} = this.props;

        if (!marker) {
            return null;
        }

        let pointOffset = {...MARKER_OFFSET};

        if (marker.isTrashpile) {
            pointOffset = {...TRASHPILE_MARKER_OFFSET};
        }

        let showLabel = marker.isTrashpile && marker.count > 0;

        let markerImage;
        if (marker.status === undefined || marker.status === null) {
            if (marker.isMarked === true || marker.isMarked === undefined) {
                markerImage = require('../../assets/images/icLocationPinActive.png')
            } else {
                markerImage = require('../../assets/images/icLocationPinInactive.png')
            }
        } else {
            if (marker.isMarked) {
                if (marker.isSelected) {
                    markerImage = require('./images/pin/icActiveAddedCopy.png')
                } else {
                    markerImage = require('./images/pin/icInactiveAdded.png')
                }
            } else {
                if (marker.isSelected) {
                    markerImage = SELECTED_STATUS_IMAGES[marker.status]
                } else {
                    markerImage = STATUS_IMAGES[marker.status]
                }
            }
        }
        console.log('Coordinate', marker.location)
        return (
            <MapView.Marker
                coordinate={marker.location}
                onPress={onMarkerPress}
                style={!marker.isTrashpile ? {zIndex: 2} : null}
                image={markerImage}
                identifier={String(marker.id)}>
                {showLabel &&
                    <View style={styles.labelContainer}>
                        <Text style={styles.labelText}>
                            {marker.count}
                        </Text>
                    </View>
                }
                <MapView.Callout tooltip>
                    <View/>
                </MapView.Callout>
            </MapView.Marker>
        );
    }

}
