import React from 'react';
import {
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { icBackToMyLocation } from '../../assets/images/icons';
import styles from './styles';


const CurrentLocationButton = ({ onCurrentLocationPress, style }) => {
  return (<TouchableOpacity
    style={[styles.locationButtonContainer, style]}
    onPress={onCurrentLocationPress}
  >
    <Image
      style={styles.locationImage}
      source={icBackToMyLocation}
    />
  </TouchableOpacity>);
};

CurrentLocationButton.propTypes = {
  onCurrentLocationPress: PropTypes.func,
};

export default CurrentLocationButton;
