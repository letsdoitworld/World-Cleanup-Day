import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

const Button = ({ text, onPress }) => {
  const TouchableWrapper = onPress ? TouchableOpacity : View;
  return (
    <TouchableWrapper style={styles.container} onPress={onPress}>
      <Text style={styles.textStyles}>{text}</Text>
    </TouchableWrapper>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export { Button };
