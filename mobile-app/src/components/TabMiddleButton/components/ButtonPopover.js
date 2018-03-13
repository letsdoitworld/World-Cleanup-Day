import React from 'react';
import { View, Text, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import { SimpleButton } from '../../Button';
import { getHeightPercentage, getWidthPercentage, isIOS } from '../../../shared/helpers';
import { SCREEN_WIDTH } from '../../../shared/constants';

const styles = EStyleSheet.create({
  $widthSize20: getWidthPercentage(20),
  container: {
    width: SCREEN_WIDTH * 9 / 10,
    backgroundColor: 'white',
    borderRadius: '$radius10',
  },
  textWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: getHeightPercentage(20),
    paddingHorizontal: '$widthSize20',
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: getHeightPercentage(10),
    // fontFamily: '$boldFont',
    textAlign: 'center',
    marginHorizontal: '$widthSize20',
  },
  description: {
    fontSize: 13,
    // fontFamily: 'noto-sans-regular',
    textAlign: 'center',
    marginHorizontal: '$widthSize20',
  },
  button: {
    backgroundColor: '#F0F0F0',
    paddingVertical: getHeightPercentage(15),
    borderBottomLeftRadius: '$radius10',
    borderBottomRightRadius: '$radius10',
  },
  imageContainer: {
    width: SCREEN_WIDTH * 9 / 10,
    height: getHeightPercentage(134),
  },
  imageStyles: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
});
const ButtonPopover = ({ t, onPress, popoverMessage }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('./download.png')} style={styles.imageStyles} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>
          {popoverMessage}
        </Text>
        <Text style={styles.description}>
          {t('label_text_popover_text')}
        </Text>
      </View>
      <View style={styles.button}>
        <SimpleButton onPress={onPress} text={t('label_button_acknowledge')} />
      </View>
    </View>
  );
};

export default translate()(ButtonPopover);
