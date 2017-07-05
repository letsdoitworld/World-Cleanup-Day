import React from 'react';
import { View } from 'react-native';

import { getHeightPercentage } from '../../../shared/helpers';

const GRADATION_LINE_HEIGHT = getHeightPercentage(10);

const GradationLine = ({ flexValue, disabled = false }) => {
  const styles = {
    height: GRADATION_LINE_HEIGHT,
    flex: flexValue,
    borderRightColor: disabled ? '#7f7f7f' : '#4aa5ff',
    borderStyle: 'solid',
    borderRightWidth: 2,
  };
  return <View style={styles} />;
};

export default GradationLine;
