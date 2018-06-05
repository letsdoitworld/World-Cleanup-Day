import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';

import styles from './styles';

export const SearchButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.searchButton}>
      <Text style={styles.searchButtonText}>Search this area</Text>
    </TouchableOpacity>
  );
};

SearchButton.propTypes = {
  onPress: PropTypes.any,
};

SearchButton.defaultProps = {
  onPress: () => {
  },
};
