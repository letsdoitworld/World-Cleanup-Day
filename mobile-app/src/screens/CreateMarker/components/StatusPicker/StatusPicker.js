import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import strings from '../../../../assets/strings';

import styles from './styles';

export const options = {
  threat: {
    id: 'threat',
    label: 'label_trash_status_urgent',
    image: require('./images/unselected/icToxicTrashpointSmall.png'),
    selectedImage: require('./images/selected/icToxicTrashpointSmall.png'),
    color: '#fc515e',
  },
  regular: {
    id: 'regular',
    label: 'label_trash_status_regular',
    image: require('./images/unselected/icRegularTrashpointCopy.png'),
    selectedImage: require('./images/selected/icRegularTrashpointCopy.png'),
    color: '#ff7a00',
  },
  cleaned: {
    id: 'cleaned',
    label: 'label_trash_status_cleaned',
    image: require('./images/selected/icRegularTrashpointCopy2.png'),
    selectedImage: require('./images/selected/icRegularTrashpointCopy2.png'),
    color: '#7BEA4E',
  },
};

const StatusPicker = (props) => {
  const { value, onChange } = props;

  const display = props.display
    ? props.display
    : ['threat', 'regular'];
  console.log(display);
  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        {display.map((prop) => {
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
                <Text style={[styles.imageText, isSelected
                  ? { color: 'rgb(0, 143, 223)' } : {}]}
                >
                  {strings[option.label].toUpperCase()}
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
  onChange: PropTypes.func,
  display: PropTypes.array,
  value: PropTypes.string,
};

export default StatusPicker;
