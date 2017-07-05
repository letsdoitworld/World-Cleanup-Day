import React, { Component } from 'react';
import { MapView } from 'expo';
import { View, Image, Text } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

const MARKER_STATUS_IMAGES = {
  cleaned: require('./images/pointer_cleaned.png'),
  outdated: require('./images/pointer_outdated.png'),
  regular: require('./images/pointer_regular.png'),
  threat: require('./images/pointer_threat.png'),
  user: require('./images/location_pointer.png'),
  changeLocation: require('./images/change_location_pin.png'),
};

const TRASHPILE_MARKER_OFFSET = {
  x: 4,
  y: -15,
};

const MARKER_OFFSET = {
  x: 0,
  y: 0,
};

const Marker = ({ marker, onMarkerPress, index }) => {
  if (!marker) {
    return null;
  }

  let pointOffset = { ...MARKER_OFFSET };

  if (marker.isTrashpile) {
    pointOffset = { ...TRASHPILE_MARKER_OFFSET };
  }

  let showLabel = marker.isTrashPile && marker.clusterCount > 0;

  return (
    <MapView.Marker
      coordinate={marker.latlng}
      onPress={() => onMarkerPress(index)}
      centerOffset={pointOffset}
      style={!marker.isTrashPile ? { zIndex: 2 } : null}
      image={MARKER_STATUS_IMAGES[marker.status]}
    >
      {showLabel &&
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>
            {marker.clusterCount}
          </Text>
        </View>}
      <MapView.Callout tooltip>
        <View />
      </MapView.Callout>
    </MapView.Marker>
  );
};

Marker.propTypes = {
  marker: PropTypes.shape({
    latlng: PropTypes.shape(
      PropTypes.objectOf({
        latitude: PropTypes.number,
        longitude: PropTypes.number,
      }),
    ),
    title: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  onMarkerPress: PropTypes.func,
};

export default Marker;
