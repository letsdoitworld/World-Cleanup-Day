import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import Slider from 'react-native-slider';
import { getWidthPercentage } from '../../shared/helpers';

const GradationLine = (props) => (
  <View
    style={{
      width: 2,
      height: getWidthPercentage(15),
      backgroundColor: "#4AA5FF",
    }}
  />
);

const Gradation = (props) => (
  <View 
    style={{
      position: 'absolute',
      left: props.position - props.imageSize / 2,
      top: 0,
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    <Image
      source={props.image}
      resizeMode="contain"
      style={{
        marginBottom: 10,
        width: props.imageSize,
        height: props.imageSize,
      }}
    />
    <GradationLine />
  </View>
);
Gradation.defaultProps = {
  imageSize: getWidthPercentage(23),
};
Gradation.propTypes = {
  imageSize: PropTypes.number,
};

const CustomSlider = (props) => {
  return (
    <View
      style={{
        marginTop: 30,
        height: getWidthPercentage(62),
        flexDirection: 'row',
        width: props.width,
      }}
    >
      {props.gradationData.map(data => (
        <Gradation
          position={data.position}
          image={data.image}
        />
      ))}

      <Slider
        width={props.width}
        maximumValue={props.maximumValue}
        step={props.step}
        onValueChange={props.onValueChange}
        trackStyle={{
          height: props.trackHeight,
          backgroundColor: '#F7F7F7',
          borderRadius: props.trackHeight,
        }}
        thumbStyle={{
          height: props.knobSize,
          width: props.knobSize,
          borderRadius: props.knobSize,
          borderColor: '#FFFFFF',
          borderWidth: props.knobSize - props.innerKnobSize,
          backgroundColor: '#4AA5FF',
        }}
        style={{
          position: 'absolute',
          bottom: 0,
        }}
        minimumTrackTintColor="#4AA5FF"
        maximumTrackTintColor="#4AA5FF"
      />
    </View>
  );
};

CustomSlider.defaultProps = {
  knobSize: getWidthPercentage(20),
  innerKnobSize: getWidthPercentage(15),
  trackHeight: getWidthPercentage(9),
};

CustomSlider.propTypes = {
  width: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  maximumValue: PropTypes.number.isRequired,
  onValueChange: PropTypes.func,
  knobSize: PropTypes.number,
  innerKnobSize: PropTypes.number,
  trackHeight: PropTypes.number,
  gradationData: PropTypes.shape({
    position: PropTypes.number.isRequired,
    image: PropTypes.object,
  }),
};

export default CustomSlider;