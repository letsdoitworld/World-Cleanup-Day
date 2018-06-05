/* eslint-disable no-undef */
import React from 'react';
import { View, Image, Text } from 'react-native';

import { getHeightPercentage } from '../../shared/helpers';
import styles from './styles';

const STATUS_STATE = {
  threat: {
    text: 'label_trash_status_state_threat',
    image: require('./images/icon_status_small_threat.png'),
    textStyle: { color: '#EB5757' },
    imageStyle: { height: getHeightPercentage(15) },
  },
  cleaned: {
    text: 'label_trash_status_state_cleaned',
    image: require('./images/icon_status_small_clean.png'),
    textStyle: { color: '#5EBB38' },
    imageStyle: { height: getHeightPercentage(13) },
  },
  outdated: {
    text: 'label_trash_status_state_outdated',
    image: require('./images/icon_status_small_outdated.png'),
    textStyle: { color: '#808080' },
    imageStyle: { height: getHeightPercentage(14) },
  },
  regular: {
    text: 'label_trash_status_state_regular',
    image: require('./images/icon_status_small_regular.png'),
    textStyle: { color: '#FF7A00' },
    imageStyle: { height: getHeightPercentage(14) },
  },
};

const StatusText = ({ status, t }) => {
  const state = STATUS_STATE[status];
  if (!state) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Image
        source={state.image}
        style={[styles.image, state.imageStyle]}
        resizeMode="contain"
      />
      <Text style={[styles.text, state.textStyle]}>
        {t(state.text)}
      </Text>
    </View>
  );
};

export default translate()(StatusText);
