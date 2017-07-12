import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import {getWidthPercentage} from '../../shared/helpers';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: getWidthPercentage(10)
  },
  image: {},
});

const ImageButton = ({ source, onPress, imageStyles }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
    >
      <Image source={source} style={[styles.image, imageStyles]} />
    </TouchableOpacity>
  );
};

export default ImageButton;
