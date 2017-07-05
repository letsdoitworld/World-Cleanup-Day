import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

const Tab = ({
  activeImage,
  inactiveImage,
  active = false,
  onPress,
  icon,
  children,
}) => {
  let image = active ? activeImage : inactiveImage;
  let content = icon ? icon : image;

  if (children) {
    content = children;
  }

  return (
    <TouchableWithoutFeedback style={styles.touchable} onPress={onPress}>
      <View style={styles.touchable}>
        {content}
      </View>
    </TouchableWithoutFeedback>
  );
};

Tab.propTypes = {
  onPress: PropTypes.func,
  icon: PropTypes.element,
  activeImage: PropTypes.element,
  inactiveImage: PropTypes.element,
  active: PropTypes.bool,
  children: PropTypes.any,
};

export default Tab;
