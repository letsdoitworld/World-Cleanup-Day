import React from 'react';
import PropTypes from 'prop-types';
import { Image, Modal, Text, TouchableWithoutFeedback, View} from 'react-native';


import styles from './styles';

const image = require('./images/icon_notification_warning.png');

const LocationAlertModal = ({
  title,
  subtitle,
  visible,
  onOverlayPress,
  onPress,
  isImageInvisible,
  onDismiss,
}) => {
  return (
    <Modal
      onDismiss={onDismiss}
      onRequestClose={onOverlayPress}
      transparent
      visible={visible}
      animationType="fade"
    >
      <TouchableWithoutFeedback onPress={onOverlayPress}>
        <View style={styles.locationbackground}>
          <View style={styles.locationfullSize}>
            <TouchableWithoutFeedback onPress={onPress}>
              <View style={styles.locationmainContainer}>
                {
                  !isImageInvisible &&
                  <Image
                    source={image}
                    style={styles.locationimage}
                    resizeMode="contain"
                  />
                }
                <Text style={styles.locationheader}>{title}</Text>
                <Text style={styles.locationsubHeader}>
                  {subtitle}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
LocationAlertModal.defaultProps = {
  onOverlayPress: () => null,
  onPress: () => null,
  visible: true,
};
LocationAlertModal.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  onOverlayPress: PropTypes.func,
  onPress: PropTypes.func,
  visible: PropTypes.bool,
  isImageInvisible: PropTypes.bool,
};

export default LocationAlertModal;
