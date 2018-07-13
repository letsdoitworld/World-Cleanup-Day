import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

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

ImageToggleContainer.propTypes = {
  flexValue: PropTypes.number,
  translationValue: PropTypes.number,
  children: PropTypes.object,
};

export default ImageToggleContainer;
