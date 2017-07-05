import React from 'react';
import { TouchableHighlight, Text } from 'react-native';

import styles from './styles';

const SimpleButton = ({onPress, text, textStyles = {}}) => {
  return (
    <TouchableHighlight
      style={styles.container}
      onPress={onPress}
      underlayColor='transparent'
    >
      <Text style={[styles.text, textStyles]}>
        {text}
      </Text>
    </TouchableHighlight>
  );
};

SimpleButton.defaultProps = {
  onPress: () => {
  }
};

export default SimpleButton;