import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';

import { SimpleButton } from '../Buttons';

import styles from './styles';

const image = require('./images/icon_notification_warning.png');

const AlertModal = ({
  title,
  subtitle,
  buttons,
  visible,
  onOverlayPress,
  onPress,
}) => {
  const buttonContainerStyles = [styles.buttonContainer];
  const containerStyles = [styles.container];
  if (buttons.length > 0) {
    buttonContainerStyles.push({
      justifyContent: buttons.length === 1 ? 'center' : 'space-between',
    });
  } else {
    containerStyles.push(styles.noButtonsContainer);
  }

  return (
    <Modal
      onRequestClose={onOverlayPress}
      transparent
      visible={visible}
      animationType="fade"
    >
      <TouchableWithoutFeedback onPress={onOverlayPress}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            flex: 1,
          }}
        >
          <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={onPress}>
              <View style={containerStyles}>
                <Image
                  source={image}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Text style={styles.header}>{title}</Text>
                <Text style={styles.subHeader}>
                  {subtitle}
                </Text>
                {buttons &&
                  buttons.length > 0 &&
                  <View style={buttonContainerStyles}>
                    {buttons.map(
                      ({ text: buttonText, onPress, style }, index) => {
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
                  </View>}
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
