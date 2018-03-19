import React, {Component} from 'react';
import {View, Image, Text} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import MapView from 'react-native-maps';

import styles from './styles';

export const MARKER_MARKED_STATUS_IMAGES = {
    cleaned: require('./images/status/icActiveCleanedTrashpointMap.png'),
    outdated: require('./images/status/icActiveInactiveTrashpointMap.png'),
    regular: require('./images/status/icActiveRegularTrashpointMap.png'),
    threat: require('./images/status/icActiveToxicTrashpointMap.png'),
    user: require('./images/status/icActiveInactiveToxicTrashpointMap.png'),
};

export const MARKER_STATUS_IMAGES = {
    cleaned: require('./images/status/icInactiveCleanedTrashpointMap.png'),
    outdated: require('./images/status/icInactiveInactiveTrashpointMap.png'),
    regular: require('./images/status/icInactiveRegularTrashpointMap.png'),
    threat: require('./images/status/icInactiveToxicTrashpointMap.png'),
    user: require('./images/status/icInactiveInactiveToxicTrashpointMap.png'),
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
                markerImage = MARKER_MARKED_STATUS_IMAGES[marker.status]
            } else {
                markerImage = MARKER_STATUS_IMAGES[marker.status]
            }
        }

        return (
            <MapView.Marker
                coordinate={marker.latlng}
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
