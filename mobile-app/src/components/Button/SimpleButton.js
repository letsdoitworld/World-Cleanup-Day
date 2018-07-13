import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';

import styles from './styles';

export const SimpleButton = ({ onPress, text }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.confirmButton}
    >
      <Text style={styles.confirmButtonText}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

SimpleButton.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.any,
};

SimpleButton.defaultProps = {
  onPress: () => {
  },
};
