import React from 'react';
import { View } from 'react-native';

import styles from './styles';

const Divider = ({customStyles = {}}) => {
  return <View>
    <View style={[styles.container1, customStyles]} />
    <View style={[styles.containe2]} />
  </View>;
};

export default Divider;
