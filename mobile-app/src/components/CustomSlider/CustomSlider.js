import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Image, View } from 'react-native';
import Slider from 'react-native-slider';
import { getWidthPercentage } from '../../shared/helpers';
import styles from './styles';
import { colors } from '../../themes';

const { width } = Dimensions.get('window');
const GradationImage = props => (
  <View
    key={props.index}
    style={[styles.gradationImageStyle, { left: props.position }]}
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
  </View>
);
const GradationText = props => (
  <View
    key={props.text}
    style={[{ left: props.position,
      width: width - props.paddingHorizontal * 4 }, styles.gradationTextStyle]
    }
  >
    {props.text}
  </View>
);
GradationImage.defaultProps = {
  imageSize: getWidthPercentage(23),
};
GradationImage.propTypes = {
  imageSize: PropTypes.number,
};
GradationText.propTypes = {
  text: PropTypes.object,
};

const CustomSlider = (props) => {
  this.componentWidth = width - props.paddingHorizontal * 4;

  this.one_to_eight = (this.componentWidth / 3) + (props.knobSize / 2) - 40;

  this.gradationPosition = props.paddingHorizontal * 2 + props.knobSize / 2 - 42.5;
  this.gradationPositionText = props.paddingHorizontal * 2 + props.knobSize / 2 - 72.5;

  return (
    <View style={styles.mainContainer}>
      {
        props.gradationData.map((data, index) => {
          const view = <GradationImage
            key={index}
            index={index}
            position={this.gradationPosition}
            image={data.image}
          />;
          this.gradationPosition += this.one_to_eight + 30;
          return view;
        })
      }
      <View style={styles.sliderStyle}>
        <View style={styles.blueDot} />
        <View style={styles.blueDot2} />
        <View style={styles.blueDot3} />
        <Slider
          width={props.width}
          maximumValue={props.maximumValue}
          step={props.step}
          value={props.initialValue}
          onValueChange={props.onValueChange}
          trackStyle={styles.trackStyle}
          thumbStyle={styles.thumbStyle}
          minimumTrackTintColor={colors.blueDot}
          maximumTrackTintColor={colors.blueDot}
        />
        {
          props.gradationData.map((data, index) => {
            const view = <GradationText
              key={index}
              position={this.gradationPositionText}
              text={data.text}
            />;
            this.gradationPositionText += this.one_to_eight + 30;
            return view;
          })
        }
      </View>

    </View>
  );
};

CustomSlider.defaultProps = {
  knobSize: getWidthPercentage(20),
  innerKnobSize: getWidthPercentage(15),
  trackHeight: getWidthPercentage(9),
};

CustomSlider.propTypes = {
  step: PropTypes.number.isRequired,
  maximumValue: PropTypes.number.isRequired,
  onValueChange: PropTypes.func,
  gradationData: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.object.isRequired,
      image: PropTypes.number,
    }),
  ),
};

export default CustomSlider;
