import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native';

import { SimpleButton } from '../Buttons';

import styles from './styles';

const image = require('./images/icon_notification_warning.png');

const AlertModal = ({ headerText, text, buttons }) => {
  const buttonContainerStyles = [styles.buttonContainer];
  buttonContainerStyles.push({
    justifyContent: buttons.length === 1 ? 'center' : 'space-between',
  });

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text style={styles.header}>{headerText}</Text>
      <Text style={styles.subHeader}>
        {text}
      </Text>
      <View style={buttonContainerStyles}>
        {buttons.map(({ text: buttonText, onPress, style }, index) => {
          return (
            <SimpleButton
              key={index}
              onPress={onPress}
              textStyles={style || {}}
              text={buttonText}
            />
          );
        })}

      </View>
    </View>
  );
};
AlertModal.propTypes = {
  headerText: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      onPress: PropTypes.func.isRequired,
      style: PropTypes.any,
    }),
  ).isRequired,
};

export default AlertModal;
