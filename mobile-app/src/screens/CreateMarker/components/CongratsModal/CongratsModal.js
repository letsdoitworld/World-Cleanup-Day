import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View, Text, Image } from 'react-native';
import { Button } from '../../../../components/Button';

import styles from './styles';

const noop = () => null;
const CongratsModal = ({ onContinuePress, t }) => {
  return (
    <Modal animationType="fade" visible onRequestClose={noop}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          resizeMode="contain"
          source={require('./images/image.png')}
        />
        <Text style={styles.imageText}>{t('label_text_congrats_image')}</Text>
        <Text style={styles.header}>{t('label_text_congrats_subtitle')}</Text>
        <Text style={styles.subHeader}>
          {t('label_text_congrats_text')}
        </Text>
        <Button
          onPress={onContinuePress}
          style={styles.button}
          text={t('label_button_continue')}
        />
      </View>
    </Modal>
  );
};
CongratsModal.propTypes = {
  onContinuePress: PropTypes.func.isRequired,
};

export default translate()(CongratsModal);
