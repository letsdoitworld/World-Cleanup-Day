import React from 'react';
import { View } from 'react-native';

import styles from './styles';

export const Divider = ({customStyles = {}, hasTopLine = true, hasBottomLine = true}) => {
  return (
    <View>
      {hasTopLine && <View style={[styles.container1, customStyles]} />}
      {hasBottomLine && <View style={[styles.containe2]} />}
    </View>
  );
};


