import React from 'react';
import {MapView} from 'expo';
import {View, Text, ImageBackground} from 'react-native';

import styles from './styles';

const MarkerView = ({showLabel, marker, onMarkerPress, image}) =>
  <MapView.Marker
    coordinate={marker.latlng}
    onPress={onMarkerPress}
    style={[!marker.isTrashpile ? {zIndex: 2} : null]}
    identifier={String(marker.id)}
  >
    <ImageBackground
      resizeMode="contain"
      style={{width: 40, height: 40}}
      source={image}>
      {showLabel &&
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>
          {marker.count}
        </Text>
      </View>}
      <MapView.Callout tooltip>
        <View/>
      </MapView.Callout>
    </ImageBackground>
  </MapView.Marker>

export default MarkerView;
