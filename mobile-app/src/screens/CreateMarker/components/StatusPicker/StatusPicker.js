import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';

import styles from './styles';

export const options = {
  threat: {
    id: 'threat',
    label: 'label_trash_status_threat',
    image: require('./images/default-status-threat.png'),
    selectedImage: require('./images/selected-status-threat.png'),
    color: '#fc515e',
  },
  regular: {
    id: 'regular',
    label: 'label_trash_status_regular',
    image: require('./images/default-status-regular.png'),
    selectedImage: require('./images/selected-status-regular.png'),
    color: '#ff7a00',
  },
  cleaned: {
    id: 'cleaned',
    label: 'label_trash_status_cleaned',
    image: require('./images/default-status-clean.png'),
    selectedImage: require('./images/selected-status-clean.png'),
    color: '#7BEA4E',
  },
};

const StatusPicker = ({ value, onChange, display = ['threat', 'regular'], t }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {t('label_text_createTP_status_subtitle')}
      </Text>
      <Text style={styles.subHeader}>
        {t('label_text_createTP_status_text')}
      </Text>
      <View style={styles.optionsContainer}>
        {display.map(prop => {
          const option = options[prop];
          const isSelected = value === option.id;
          const onImagePress = () => onChange(option.id);
          return (
            <TouchableWithoutFeedback key={option.id} onPress={onImagePress}>
              <View style={styles.option}>
                <Image
                  style={isSelected ? styles.selectedImage : styles.image}
                  resizeMode="contain"
                  source={isSelected ? option.selectedImage : option.image}
                />
                <Text style={[styles.imageText, { color: option.color }]}>
                  {t(option.label).toUpperCase()}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </View>
  );
};

StatusPicker.propTypes = {
  // options: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     id: PropTypes.number.isRequired,
  //     label: PropTypes.string.isRequired,
  //     image: PropTypes.string.isRequired,
  //   }).isRequired,
  // ).isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default translate()(StatusPicker);
