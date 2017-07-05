import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import PropTypes from 'prop-types';

import styles from './styles';

const SocialButton = ({ icon, color, style = {}, text, onPress }) => {
  const textStyles = [styles.text];
  const iconContainerStyles = [styles.iconContainer];
  if (color) {
    textStyles.push({ color });
    iconContainerStyles.push({ backgroundColor: color });
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.container, style]}>
        <View style={iconContainerStyles}>
          <MaterialCommunityIcons
            name={icon}
            size={styles.$iconSize}
            color="white"
            style={styles.icon}
          />
        </View>
        <Text style={textStyles}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

SocialButton.defaultProps = {
  style: {},
};

SocialButton.propTypes = {
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
};
export default SocialButton;
