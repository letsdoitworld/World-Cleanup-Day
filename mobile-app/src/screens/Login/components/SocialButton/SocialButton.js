import React from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

const SocialButton = ({ icon, color, style = {}, text,
  onPressBtn, backgroundColor = 'black' }) => {
  const textStyles = [styles.text];
  const iconContainerStyles = [styles.iconContainer];
  if (color) {
    iconContainerStyles.push({ backgroundColor: color });
  }

  return (
    <TouchableOpacity onPress={onPressBtn} activeOpacity={0.7}>
      <View style={[styles.container, style, { backgroundColor }]}>
        <View style={iconContainerStyles}>
          <Image style={styles.icon} source={icon} />
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
  icon: PropTypes.number.isRequired,
};
export default SocialButton;
