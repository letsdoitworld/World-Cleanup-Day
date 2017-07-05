import React from 'react';
import { View } from 'react-native';

import { getWidthPercentage } from '../../../shared/helpers';

const ImageToggleContainer = ({ flexValue, translationValue, children }) => {
  const styles = {
    flex: flexValue,
    alignItems: 'flex-end',
    transform: [{ translateX: getWidthPercentage(translationValue) }],
  };
  return (
    <View style={styles}>
      {children}
    </View>
  );
};

export default ImageToggleContainer;
