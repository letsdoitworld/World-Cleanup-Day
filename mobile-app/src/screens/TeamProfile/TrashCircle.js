import React from 'react';
import { View, Text } from 'react-native';

import styles from './styles';

const STATUSES_SETTINGS = {
  threat: {name: 'THREAT', color: '#eb6568', borderColor: '#dd5357'},
  regular: {name: 'REGULAR', color: '#f09135', borderColor: '#e1853d'},
  cleaned: {name: 'CLEANED', color: '#88d15b', borderColor: '#79b752'},
  outdated: {name: 'OUTDATED', color: '#d0d0d0', borderColor: '#b3b3b3'},
};

const TrashCircle = ({count = 0, status}) => {
  const { name, color, borderColor } = STATUSES_SETTINGS[status];
  return (
  <View style={styles.circleContainer}>
    <View style={[styles.circle, { backgroundColor: color, borderColor}]}>
      <View style={styles.circleTextContainer}>
        <Text style={styles.circleText}>{count}</Text>
      </View>
    </View>
    <Text style={[styles.circleText, { color }]}>{name}</Text>
  </View>
)};

export default TrashCircle;
