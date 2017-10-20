import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import _ from 'lodash';

import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';

const styles = EStyleSheet.create({
  container: {
    height: getHeightPercentage(40),
    paddingLeft: getWidthPercentage(20),
    paddingRight: getWidthPercentage(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#3e8ede',
    shadowOpacity: 0.07,
    shadowRadius: 0,
    shadowColor: '#000000',
    shadowOffset: { height: 3, width: 0 },
  },
  text: {
    textAlign: 'center',
    color: '$white',
    fontFamily: 'noto-sans-bold',
    fontSize: 13,
  },
  disabledText: {
    color: '#808080',
  },
  disabledBackground: {
    backgroundColor: '$grey',
  },
});

const BlueButton = ({ style, text, onPress, customStyles, disabled }) => {
  const touchableStyles = [styles.container];
  const textStyles = [styles.text];
  let handleOnPress = onPress;
  if (_.has(customStyles, 'touchableContainer')) {
    touchableStyles.push(customStyles.touchableContainer);
  }

  if (_.has(customStyles, 'text')) {
    textStyles.push(customStyles.text);
  }

  if(disabled){
    touchableStyles.push(styles.disabledBackground);
    textStyles.push(styles.disabledText);
    handleOnPress = _.noop;
  }

  return (
    <View style={style}>
      <TouchableOpacity style={touchableStyles} onPress={handleOnPress}>
        <Text style={textStyles}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};
BlueButton.defaultProps = {
  style: {},
};

BlueButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default BlueButton;
