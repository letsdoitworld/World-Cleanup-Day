import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Image, View } from 'react-native';
import Slider from 'react-native-slider';
import { getWidthPercentage } from '../../shared/helpers';
import styles from './styles';

const { width } = Dimensions.get('window');

const Gradation = props => (
  <View
    key={props.text}
    style={{
      width: 65,
      position: 'absolute',
      left: props.position,
      top: 40,
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
    {props.text}
  </View>
);
Gradation.defaultProps = {
  imageSize: getWidthPercentage(23),
};
Gradation.propTypes = {
  imageSize: PropTypes.number,
  text: PropTypes.object,
};


const CustomSlider = (props) => {
  this.componentWidth = width - props.paddingHorizontal * 4;

  this.one_to_eight = (this.componentWidth / 3) + (props.knobSize / 2) - 20;

  this.gradationPosition = props.paddingHorizontal * 2 + props.knobSize / 2 - 32.5;

  return (
    <View style={styles.mainContainer}>

      <View style={[styles.blueDot,
        { left: props.paddingHorizontal * 2 + 5 + this.one_to_eight }]}
      />
      <View style={[styles.blueDot, { left: getWidthPercentage(196) }]} />
      <View style={[styles.blueDot, { left: getWidthPercentage(278) }]} />

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
        minimumTrackTintColor="#4AA5FF"
        maximumTrackTintColor="#4AA5FF"
      />

      {
        props.gradationData.map((data) => {
          const view = <Gradation
            key={data.text}
            position={this.gradationPosition}
            image={data.image}
            text={data.text}
          />;
          this.gradationPosition += this.one_to_eight;
          return view;
        })
      }
    </View>
  );
};

CustomSlider.defaultProps = {
  knobSize: getWidthPercentage(20),
  innerKnobSize: getWidthPercentage(15),
  trackHeight: getWidthPercentage(9),
};

CustomSlider.propTypes = {
  paddingHorizontal: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  maximumValue: PropTypes.number.isRequired,
  onValueChange: PropTypes.func,
  knobSize: PropTypes.number,
  innerKnobSize: PropTypes.number,
  trackHeight: PropTypes.number,
  gradationData: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.object.isRequired,
      image: PropTypes.number,
    }),
  ),
};

export default CustomSlider;
