import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import MapView from 'react-native-maps';

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

export const Marker = ({ marker, onMarkerPress = _.noop }) => {
  if (!marker) {
    return null;
  }

  let pointOffset = { ...MARKER_OFFSET };

  if (marker.isTrashpile) {
    pointOffset = { ...TRASHPILE_MARKER_OFFSET };
  }

  let showLabel = marker.isTrashpile && marker.count > 0;

  return (
    <MapView.Marker
      coordinate={marker.latlng}
      onPress={onMarkerPress}
      style={!marker.isTrashpile ? { zIndex: 2 } : null}
      image={MARKER_STATUS_IMAGES[marker.status]}
      identifier={String(marker.id)}
    >
      {showLabel &&
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>
            {marker.count}
          </Text>
        </View>}
      <MapView.Callout tooltip>
        <View />
      </MapView.Callout>
    </MapView.Marker>
  );
};

Marker.propTypes = {
  // disabled becuase of too many warnings
  // TODO fix this
  // marker: PropTypes.shape({
  //   latlng: 
  //     PropTypes.objectOf({
  //       latitude: PropTypes.number,
  //       longitude: PropTypes.number,
  //     }),
  //   title: PropTypes.string,
  //   description: PropTypes.string,
  // }),
  onMarkerPress: PropTypes.func,
};

//export default Marker;
