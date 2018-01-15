import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import Slider from 'react-native-slider';

const GradationLine = (props) => (
  <View
    style={{
      width: 2,
      height: 28,
      backgroundColor: "#4AA5FF",
    }}
  />
);

const Gradation = (props) => (
  <View 
    style={{
      position: 'absolute',
      left: props.position - 16.5,
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
        width: 33,
        height: 33,
      }}
    />
    <GradationLine />
  </View>
);

const CustomSlider = (props) => {
  return (
    <View
      style={{
        marginTop: 30,
        height: 88,
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
  knobSize: 32,
  innerKnobSize: 24,
  trackHeight: 14,
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