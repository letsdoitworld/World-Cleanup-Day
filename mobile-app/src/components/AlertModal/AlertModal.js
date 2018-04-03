import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';

import { SimpleButton } from '../Button/SimpleButton';

import styles from './styles';
import {getHeightPercentage} from "../../shared/helpers";

const image = require('./images/icon_notification_warning.png');

const AlertModal = ({
  title,
  subtitle,
  buttons,
  visible,
  onOverlayPress,
  onPress,
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
            <TouchableWithoutFeedback onPress={onPress}>
              <View style={styles.mainContainer}>
                <Image
                  source={image}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Text style={styles.header}>{title}</Text>
                <Text style={styles.subHeader}>
                  {subtitle}
                </Text>
                {buttons && buttons.length > 0 &&
                  <View style={styles.buttonsContainer}>
                    {buttons.map(({ text: buttonText, onPress, style }, index) => {
                        return (
                          <SimpleButton
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
};

export default AlertModal;
