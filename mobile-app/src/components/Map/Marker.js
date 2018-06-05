/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import MapView from 'react-native-maps';
import { Text, View } from 'react-native';
import { Icons, LocationPinActive, LocationPinInactive } from '../../assets/images';

import styles from './styles';

export const STATUS_IMAGES = {
  cleaned: Icons.InactiveCleanedTrashpointMap,
  outdated: Icons.InactiveInactiveTrashpointMap,
  regular: Icons.InactiveRegularTrashpointMap,
  urgent: Icons.InactiveToxicTrashpointMap,
  threat: Icons.InactiveToxicTrashpointMap,
};

export const SELECTED_STATUS_IMAGES = {
  cleaned: Icons.ActiveCleanedTrashpointMap,
  outdated: Icons.ActiveInactiveTrashpointMap,
  regular: Icons.ActiveRegularTrashpointMap,
  urgent: Icons.ActiveToxicTrashpointMap,
  threat: Icons.ActiveToxicTrashpointMap,
};

export default class Marker extends Component {
  render() {
    const { marker, onMarkerPress } = this.props;

    if (!marker) {
      return null;
    }

    const showLabel = marker.isTrashpile && marker.count > 1;
    let markerImage;
    if (marker.status === undefined || marker.status === null) {
      if (this.props.selectedItem === marker.id) {
        markerImage = LocationPinActive;
      } else {
        markerImage = LocationPinInactive;
      }
    } else if (marker.isMarked) {
      if (marker.isSelected) {
        markerImage = Icons.ActiveAddedCopy;
      } else {
        markerImage = Icons.InactiveAdded;
      }
    } else if (marker.isSelected) {
      markerImage = SELECTED_STATUS_IMAGES[marker.status];
    } else {
      markerImage = STATUS_IMAGES[marker.status];
    }
    return (
      <MapView.Marker
        coordinate={marker.latlng}
        onPress={onMarkerPress}
        style={!marker.isTrashpile ? { zIndex: 2 } : null}
        image={markerImage}
        identifier={String(marker.id)}
      >
        {showLabel &&
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>
            {marker.count}
          </Text>
        </View>
        }
        <MapView.Callout tooltip>
          <View />
        </MapView.Callout>
      </MapView.Marker>
    );
  }
}
