import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';

import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';

const image = require('./sad.png');

const styles = EStyleSheet.create({
  container: {
    height: getHeightPercentage(400),
    width: getWidthPercentage(260),
    alignItems: 'center',
  },
  image: {
    width: getWidthPercentage(260),
    height: getHeightPercentage(250),
    zIndex: 99,
  },
  imageText: {
    zIndex: 100,
    position: 'absolute',
    top: getHeightPercentage(180),
    // fontFamily: '$boldFont',
    fontSize: 22,
    color: 'white',
  },
  textContainer: {
    backgroundColor: 'white',
    height: getHeightPercentage(165),
    width: getWidthPercentage(238),
    position: 'absolute',
    top: getHeightPercentage(215),
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    paddingHorizontal: getWidthPercentage(40),
    // fontFamily: '$font',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    zIndex: 101,
    position: 'absolute',
    top: getHeightPercentage(360),
    width: getWidthPercentage(238),
    backgroundColor: '#F2F2F2',
    height: getHeightPercentage(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#3E8EDE',
    // fontFamily: '$boldFont',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

const ErrorModal = ({ onPress, title, subtitle, buttonText }) => {
  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <Image resizeMode="contain" style={styles.image} source={image} />
        <Text style={styles.imageText}>{title}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{subtitle}</Text>
        </View>
        <TouchableHighlight
          underlayColor="#cfcfcf"
          style={styles.buttonContainer}
          onPress={onPress}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableHighlight>
      </View>
    </TouchableWithoutFeedback>
  );
};

ErrorModal.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default ErrorModal;
