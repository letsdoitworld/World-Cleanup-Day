import React from 'react';
import PropTypes from 'prop-types';
import { Entypo } from '@expo/vector-icons';

import { View, Text, TouchableOpacity } from 'react-native';
import { Map } from '../../../../components/Map';
import { SCREEN_WIDTH } from '../../../../shared/constants';

// const latitude = marker.latlng.latitude;
// const longitude = marker.latlng.longitude;
// const latitudeDelta = 0.0922;
// const mapHeight = getHeightPercentage(160);
//

import styles from './styles';

const getFullAddress = ({ subLocality, locality, country }) => {
  return [subLocality, locality, country].filter(x => !!x).join(', ');
};

const LocationPicker = ({
  value: { latitude, longitude },
  address: { streetAddress = '', locality = '', country = '', streetNumber = '', subLocality = '' },
  onEditLocationPress,
  status,
}) => {
  const latitudeDelta = 0.0922;
  const longitudeDelta = latitudeDelta * SCREEN_WIDTH / styles.$mapContainerHeight;
  const marker = {
    latlng: { latitude, longitude },
    status,
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <Map
          markers={[marker]}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          initialRegion={{
            latitudeDelta,
            longitudeDelta,
            latitude,
            longitude,
          }}
          liteMode
        />
      </View>
      <Text style={styles.streetContainer}>
        {`${streetAddress} ${streetNumber}`}
      </Text>
      <View style={styles.bottomContainer}>
        <View style={styles.iconContainer}>
          <Entypo size={styles.$iconSize} name="location-pin" style={styles.icon} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            {`${getFullAddress({ subLocality, locality, country })} | ${latitude.toFixed(
              6,
            )}, ${longitude.toFixed(6)}`}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={onEditLocationPress} style={styles.editLocationContainer}>
        <Text style={styles.editLocation}>Edit location</Text>
      </TouchableOpacity>
    </View>
  );
};

LocationPicker.defaultProps = {
  value: undefined,
  address: '',
  onEditLocationPress: undefined,
};
LocationPicker.propTypes = {
  value: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  address: PropTypes.string,
  onEditLocationPress: PropTypes.func,
};
export default LocationPicker;
