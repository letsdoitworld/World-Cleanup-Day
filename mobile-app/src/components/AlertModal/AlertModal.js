/* eslint-disable no-shadow,react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Modal,
  Platform,
} from 'react-native';
import { getHeightPercentage } from '../../shared/helpers';
import { AlertButton } from '../Button/AlertButton';


import styles from './styles';


const AlertModal = ({
  title,
  text,
  subtitle,
  buttons,
  visible,
  onOverlayPress,
  onPress,
  image,
}) => {
  return (
    <Modal
      onRequestClose={onOverlayPress}
      transparent
      visible={visible}
      animationType="fade"
    >
      <TouchableWithoutFeedback onPress={onOverlayPress}>
        <View style={styles.background}>
          <View style={styles.fullSize}>
            <Image source={image} style={styles.image} />
            <TouchableWithoutFeedback onPress={onPress}>
              <View style={styles.mainContainer}>
                <Text style={styles.header}>{title}</Text>
                <Text style={styles.subHeader}>
                  {subtitle}
                </Text>
                <Text style={styles.text}>
                  {text}
                </Text>
                {buttons && buttons.length > 0 &&
                  <View style={[styles.buttonsContainer, Platform.OS === 'android'
                    ? { marginTop: getHeightPercentage(15) }
                    : {}]}
                  >
                    {buttons.map(({ text: buttonText, onPress, style }, index) => {
                      return (
                        <AlertButton
                          key={index}
                          onPress={onPress}
                          textStyles={style || {}}
                          text={buttonText}
                        />
                      );
                    },
                    )}
                  </View>
                }
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
AlertModal.defaultProps = {
  buttons: [],
  onOverlayPress: () => null,
  onPress: () => null,
  visible: true,
};
AlertModal.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      onPress: PropTypes.func.isRequired,
      style: PropTypes.any,
    }),
  ),
  onOverlayPress: PropTypes.func,
  onPress: PropTypes.func,
  visible: PropTypes.bool,
  text: PropTypes.string,
  image: PropTypes.number,
};

export default AlertModal;
