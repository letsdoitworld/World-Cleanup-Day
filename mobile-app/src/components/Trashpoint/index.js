import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { Icon } from '../Icon';

import { Icons } from '../../assets/images';

import styles from './styles';

const Trashpoint = ({
  type,
  location,
  onPress,
}) => {
  const handleImageType = () => {
    let iconPath;

    switch (type) {
      case 'regular':
        iconPath = Icons.RegularTrashpoint;
        break;
      case 'toxic':
        iconPath = Icons.ToxicTrashpoint;
        break;
      default:
        iconPath = Icons.RegularTrashpointInactive;
        break;
    }

    return iconPath;
  };

  const TouchableWrapper = onPress ? TouchableOpacity : View;

  return (
    <TouchableWrapper onPress={onPress} style={styles.container}>
      <Image source={handleImageType()} style={styles.image} />

      <View style={styles.content}>
        <Icon path={Icons.Location} containerStyle={styles.iconContainer} />
        <Text numberOfLines={1} style={styles.locationText}>{location}</Text>
      </View>
    </TouchableWrapper>
  );
};

Trashpoint.propTypes = {
  type: PropTypes.string,
  location: PropTypes.string,
  onPress: PropTypes.func,
};

export { Trashpoint };
