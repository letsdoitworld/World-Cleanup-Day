import React from 'react';
import {TouchableHighlight, Text, View} from 'react-native';

import styles from './styles';

export const SimpleButton = ({onPress, text, textStyles = {}}) => {
  return (
      <View>
        <TouchableHighlight
          style={styles.container}
          onPress={onPress}
          underlayColor='transparent'>
          <Text style={[styles.text, textStyles]}>
            {text}
          </Text>
        </TouchableHighlight>
      </View>
  );
};

SimpleButton.defaultProps = {
  onPress: () => {
  }
};
