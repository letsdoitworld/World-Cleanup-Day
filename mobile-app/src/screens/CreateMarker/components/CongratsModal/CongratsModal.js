import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View, Text, Image } from 'react-native';
import { Button } from '../../../../components/Buttons';

import styles from './styles';

const CongratsModal = ({ onContinuePress }) => {
  return (
    <Modal animationType="fade" visible>
      <View style={styles.container}>
        <Image style={styles.image} resizeMode="contain" source={require('./images/image.png')} />
        <Text style={styles.header}>Great job!</Text>
        <Text style={styles.subHeader}>Now save the point by verifying the data.</Text>
        <Button onPress={onContinuePress} style={styles.button} text="Continue" />
      </View>
    </Modal>
  );
};
CongratsModal.propTypes = {
  onContinuePress: PropTypes.func.isRequired,
};

export default CongratsModal;
