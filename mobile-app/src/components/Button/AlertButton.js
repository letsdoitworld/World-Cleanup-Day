import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';

import styles from './styles';

export const AlertButton = ({ onPress, text }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.alertButton}
    >
      <Text style={styles.alertButtonText}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

AlertButton.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.any,
};

AlertButton.defaultProps = {
  onPress: () => {
  },
};
