import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';

import styles from './styles';

export const options = {
  threat: {
    id: 'threat',
    label: 'THREAT',
    image: require('./images/default-status-threat.png'),
    selectedImage: require('./images/selected-status-threat.png'),

    color: '#fc515e',
  },
  regular: {
    id: 'regular',
    label: 'REGULAR',
    image: require('./images/default-status-regular.png'),
    selectedImage: require('./images/selected-status-regular.png'),
    color: '#ff7a00',
  },
};

const StatusPicker = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Point status
      </Text>
      <Text style={styles.subHeader}>
        If a quick action is needed (toxic, heavy metals), please set as threat.
      </Text>
      <View style={styles.optionsContainer}>
        {Object.values(options).map((option) => {
          const isSelected = value === option.id;
          const onImagePress = () => onChange(option.id);
          return (
            <TouchableWithoutFeedback key={option.id} onPress={onImagePress}>
              <View style={styles.option}>
                <Image
                  style={styles.image}
                  resizeMode="contain"
                  source={isSelected ? option.selectedImage : option.image}
                />
                <Text style={[styles.imageText, { color: option.color }]}>{option.label}</Text>
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

export default StatusPicker;
