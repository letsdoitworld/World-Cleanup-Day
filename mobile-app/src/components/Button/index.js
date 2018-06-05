import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import { Icon } from '../Icon';

import styles from './styles';

const Button = ({ text, icon, style, iconStyle, onPress }) => {
  const TouchableWrapper = onPress ? TouchableOpacity : View;
  return (
    <TouchableWrapper style={!style ? styles.container : style} onPress={onPress}>
      {text && <Text style={styles.textStyles}>{text}</Text>}
      {icon && <Icon path={icon} iconStyle={iconStyle} />}
    </TouchableWrapper>
  );
};

Button.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.styles]),
  iconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.styles]),
  icon: PropTypes.number,
  text: PropTypes.string,
  onPress: PropTypes.func,
};

export { Button };
