import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import styles from './styles';

const PhotoModal = ({ visible, onRequestClose, photoUrl }) => {
  return (
    <Modal
      visible={visible}
      onRequestClose={onRequestClose}
      style={styles.modal}
    >
      <Image
        style={{
          flex: 1,
        }}
        resizeMode="contain"
        source={{ uri: photoUrl }}
      >
        <TouchableOpacity
          onPress={onRequestClose}
          style={styles.buttonBody}
        >
          <Ionicons
            size={styles.$iconSize}
            name="md-close"
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </Image>
    </Modal>
  );
};

PhotoModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  photoUrl: PropTypes.string.isRequired,
};

export default PhotoModal;
