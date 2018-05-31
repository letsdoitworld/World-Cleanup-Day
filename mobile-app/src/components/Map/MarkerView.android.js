import React from 'react';
import {MapView} from 'expo';
import {View, Image, Text} from 'react-native';

import styles from './styles';

const MarkerView = ({marker, onMarkerPress, showLabel, image}) =>
  <MapView.Marker
    coordinate={marker.latlng}
    onPress={onMarkerPress}
    style={!marker.isTrashpile ? {zIndex: 2} : null}
    image={image}
    identifier={String(marker.id)}
  >
    {showLabel &&
    <View style={styles.labelContainer}>
      <Text style={styles.labelText}>
        {marker.count}
      </Text>
    </View>}
    <MapView.Callout tooltip>
      <View/>
    </MapView.Callout>
  </MapView.Marker>

export default MarkerView;
