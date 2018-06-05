import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { Map } from '../../../../components/Map';
import { DEFAULT_ZOOM, SCREEN_WIDTH } from '../../../../shared/constants';

import styles from './styles';
import strings from '../../../../assets/strings';


const LocationPicker = (props) => {
  const { value: { latitude, longitude }, onEditLocationPress, status, address } = props;

  const latitudeDelta = DEFAULT_ZOOM;
  const longitudeDelta = latitudeDelta * SCREEN_WIDTH / styles.$mapContainerHeight;
  const marker = {
    id: 0,
    latlng: { latitude, longitude },
    status,
  };
  return (
    <View style={styles.container}>
      <Map
        style={{
          height: 198,
          flex: 1,
        }}
        markers={[marker]}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        region={{
          latitudeDelta,
          longitudeDelta,
          latitude,
          longitude,
        }}
        liteMode
      />
      <View style={styles.row}>
        <Image
          source={require('../../../../assets/images/icTrashpointAddress.png')}
        />
        <Text
          style={styles.address}
          numberOfLines={2}
        >
          {address}
        </Text>
        <TouchableOpacity
          onPress={onEditLocationPress}
          style={styles.editLocationContainer}
        >
          <Text style={styles.editLocation}>{strings.label_edit}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

LocationPicker.propTypes = {
  value: PropTypes.object,
  address: PropTypes.string,
  onEditLocationPress: PropTypes.func,
  status: PropTypes.string,
};

export default LocationPicker;
