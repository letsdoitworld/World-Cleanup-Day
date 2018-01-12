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

class CustomSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sliderValue: 0,
    };
  }

  handleOnValueChange = (value) => {
    this.setState({
      sliderValue: value,
    });
  }

  render() {
    return (
      <View
        style={{
          marginTop: 30,
          paddingTop: 7,
          flexDirection: 'row',
          alignItems: 'center',
          // backgroundColor: 'blue',
          width: this.props.width,
        }}
      >
        {range(0, this.props.maximumValue + 1).map((currentStep) => 
          <View
            style={{
              position: 'absolute',
              left: (this.props.width / this.props.maximumValue) * currentStep,
              top: 0,
              width: 2,
              height: 30,
              backgroundColor: "#4AA5FF",
            }}
          />
        )}
        <Slider width={this.props.width} maximumValue={this.props.maximumValue} step={this.props.step}
          trackStyle={{
            height: this.props.trackHeight,
            backgroundColor: '#F7F7F7',
            borderRadius: this.props.trackHeight,
          }}
          thumbStyle={{
            height: this.props.knobSize,
            width: this.props.knobSize,
            borderRadius: this.props.knobSize,
            borderColor: '#FFFFFF',
            borderWidth: this.props.knobSize - this.props.innerKnobSize,
            backgroundColor: '#4AA5FF',
          }}
          minimumTrackTintColor="#4AA5FF"
          maximumTrackTintColor="#4AA5FF"
        />
      </View>
    );
  }
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
  gradationData: PropTypes.object,
};

CustomSlider.propTypes = {};

export default CustomSlider;