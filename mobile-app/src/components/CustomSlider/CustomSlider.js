import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,  
  View,
  Text,
} from 'react-native';
import Slider from 'react-native-slider';

import { range } from 'lodash';

const NATIVE_SLIDER_DEFAULT_MARGIN = 12;
const NATIVE_SLIDER_DEFAULT_PADDING = 16;

const CustomSlider = (props) => {
  return (
    <View
      style={{
        marginTop: 30,
        paddingTop: 7,
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'blue',
        width: props.width,
      }}
    >
      {props.gradationData.map(data =>
        <View
          style={{
            position: 'absolute',
            left: data.position,
            top: 0,
            width: 2,
            height: 30,
            backgroundColor: "#4AA5FF",
          }}
        />
      )}
      <Slider width={props.width} maximumValue={props.maximumValue} step={props.step}
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
        minimumTrackTintColor="#4AA5FF"
        maximumTrackTintColor="#4AA5FF"
      />
    </View>
  );
}

CustomSlider.defaultProps = {
  knobSize: 32,
  innerKnobSize: 24,
  trackHeight: 14,
};

CustomSlider.propTypes = {
  width: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  maximumValue: PropTypes.number.isRequired,
  knobSize: PropTypes.number,
  innerKnobSize: PropTypes.number,
  trackHeight: PropTypes.number,
  gradationData: PropTypes.shape({
    position: PropTypes.number.isRequired,
    image: PropTypes.string,
  }),
};

CustomSlider.propTypes = {};

export default CustomSlider;