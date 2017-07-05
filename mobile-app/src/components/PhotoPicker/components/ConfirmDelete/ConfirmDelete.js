import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native';

import { SimpleButton } from '../../../../components/Buttons';

import styles from './styles';

const image = require('./images/icon_notification_warning.png');

const ConfirmDelete = ({ onConfirm, onCancel }) => {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text style={styles.header}>Delete photo</Text>
      <Text style={styles.subHeader}>
        Are you sure you want to delete the photo? You cannot undo this.
      </Text>
      <View style={styles.buttonContainer}>
        <SimpleButton onPress={onCancel} textStyles={styles.cancelButton} text="Cancel" />
        <SimpleButton onPress={onConfirm} textStyles={styles.deleteButton} text="Delete" />
      </View>
    </View>
  );
};
ConfirmDelete.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmDelete;
