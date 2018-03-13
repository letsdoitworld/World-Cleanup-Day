import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import strings  from '../../assets/strings';
import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';

const image = require('./lazy.png');

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    height: getHeightPercentage(325),
    width: getWidthPercentage(220),
    zIndex: 99,
  },
  image: {
    marginTop: getHeightPercentage(95),
    height: getHeightPercentage(210),
    width: getWidthPercentage(220),
    zIndex: 99,
  },
  imageText: {
    position: 'absolute',
    // fontFamily: '$boldFont',
    fontSize: 16,
    zIndex: 100,
    top: getHeightPercentage(250),
  },
  textContainer: {
    width: getWidthPercentage(200),
    height: getHeightPercentage(115),
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: getHeightPercentage(275),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  subtext: {
    // fontFamily: '$font',
    width: getWidthPercentage(150),
    textAlign: 'center',
  },
});

const LoadingModal = ({ t }) => {
  return (
    <View style={styles.container}>
      <Image resizeMode="contain" style={styles.image} source={image} />
      <Text style={styles.imageText}>{t('label_loading_image_text')}</Text>
      <View style={styles.textContainer}>
        <Text style={styles.subtext}>{t('label_loading_image_subtext')}</Text>
      </View>
    </View>
  );
};
export default translate()(LoadingModal);
