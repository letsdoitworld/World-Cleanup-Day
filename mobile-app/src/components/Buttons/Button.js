import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import _ from 'lodash';

import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';

const styles = EStyleSheet.create({
  container: {
    backgroundColor: '#3e8ede',
    height: getHeightPercentage(35),
    width: getWidthPercentage(280),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  text: {
    textAlign: 'center',
    color: '$white',
    fontFamily: 'noto-sans-bold',
    fontSize: 13,
  },
});

const Button = ({ style, text, onPress, customStyles }) => {
  const touchableStyles = [styles.container];
  const textStyles = [styles.text];
  if (_.has(customStyles, 'touchableContainer')) {
    touchableStyles.push(customStyles.touchableContainer);
  }

  if (_.has(customStyles, 'text')) {
    textStyles.push(customStyles.text);
  }

  return (
    <View style={style}>
      <TouchableOpacity style={touchableStyles} onPress={onPress}>
        <Text style={textStyles}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};
Button.defaultProps = {
  style: {},
};

const stylePropType = [PropTypes.object, PropTypes.number];
Button.propTypes = {
  style: PropTypes.oneOf([PropTypes.arrayOf(stylePropType), ...stylePropType]),
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default Button;
