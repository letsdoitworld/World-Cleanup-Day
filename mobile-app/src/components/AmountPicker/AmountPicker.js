import React, { Component } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';

import { ImageToggle, TOGGLE_TYPE } from './components/ImageToggle';
import { getWidthPercentage } from '../../shared/helpers';
import GradationLine from './components/GradationLine';
import ImageToggleContainer from './components/ImageToggleContainer';
import styles from './styles';

const controlWidth = getWidthPercentage(280);
const leftPadding = getWidthPercentage(20);
const unit = controlWidth / 8;
const sliderPoints = [unit, 3 * unit, 5 * unit, 7 * unit];
const pressPoints = [
  2 * unit + leftPadding,
  4 * unit + leftPadding,
  6 * unit + leftPadding,
  8 * unit + leftPadding,
];
const BUTTON_MIDDLE_SIZE = getWidthPercentage(11);

const getSliderLocation = locationX => {
  let index = 0;
  if (locationX <= pressPoints[0]) {
    index = 0;
  } else if (locationX <= pressPoints[1]) {
    index = 1;
  } else if (locationX <= pressPoints[2]) {
    index = 2;
  } else {
    index = 3;
  }

  return {
    location: sliderPoints[index],
    index,
  };
};

export const AMOUNT_STATUSES = {
  handful: 0,
  bagful: 1,
  cartload: 2,
  truckload: 3,
  0: 'handful',
  1: 'bagful',
  2: 'cartload',
  3: 'truckload',
};

class AmountPicker extends Component {
  constructor(props) {
    super(props);

    const steps = [
      { selected: false, flexStyle: 0.125 },
      { selected: false, flexStyle: 0.375 },
      { selected: false, flexStyle: 0.625 },
      { selected: false, flexStyle: 0.875 },
    ];

    let initialAmount = props.amount !== undefined ? props.amount : 0;
    steps.forEach((step, index) => (step.selected = index <= initialAmount));
    this.state = {
      sliderLocation: sliderPoints[initialAmount],
      steps,
    };
  }

  handlePress = evt => {
    if (this.props.disabled) {
      return;
    }

    const sliderLocation = getSliderLocation(evt.nativeEvent.pageX);
    const steps = this.state.steps.map((step, index) => ({
      ...step,
      selected: sliderLocation.index >= index,
    }));
    this.setState(
      {
        sliderLocation: sliderLocation.location,
        steps,
      },
      () => this.props.onSelect(AMOUNT_STATUSES[sliderLocation.index]),
    );
  };

  getSliderFlexAmount = () => {
    const { steps } = this.state;
    const selectedStep = [...steps].reverse().find(step => step.selected);
    return selectedStep.flexStyle;
  };

  render() {
    const { sliderLocation, steps } = this.state;
    const [first, second, third, fourth] = steps;
    const { disabled } = this.props;
    const sliderFlexAmount = this.getSliderFlexAmount();

    return (
      <TouchableWithoutFeedback onPress={this.handlePress}>
        <View style={styles.container}>
          <View style={styles.containerImages}>
            <ImageToggleContainer flexValue={0.125} translationValue={14}>
              <ImageToggle
                selected={first.selected}
                type={TOGGLE_TYPE.handful}
                disabled={disabled}
              />
            </ImageToggleContainer>
            <ImageToggleContainer flexValue={0.25} translationValue={10}>
              <ImageToggle
                selected={second.selected}
                type={TOGGLE_TYPE.bagful}
                disabled={disabled}
              />
            </ImageToggleContainer>
            <ImageToggleContainer flexValue={0.25} translationValue={14}>
              <ImageToggle
                selected={third.selected}
                type={TOGGLE_TYPE.cartload}
                disabled={disabled}
              />
            </ImageToggleContainer>
            <ImageToggleContainer flexValue={0.25} translationValue={16.5}>
              <ImageToggle
                selected={fourth.selected}
                type={TOGGLE_TYPE.truck}
                disabled={disabled}
              />
            </ImageToggleContainer>
            <View style={styles.completer} />
          </View>

          <View style={{ flexDirection: 'row' }}>
            <GradationLine flexValue={0.125} disabled={disabled} />
            <GradationLine flexValue={0.25} disabled={disabled} />
            <GradationLine flexValue={0.25} disabled={disabled} />
            <GradationLine flexValue={0.25} disabled={disabled} />
            <View style={styles.completer} />
          </View>

          <View style={styles.touchableChildContainer}>
            <View
              style={[
                styles.barContainer,
                {
                  flex: sliderFlexAmount,
                  backgroundColor: disabled ? '#7F7F7F' : '#4AA5FF',
                },
              ]}
            />
            <View style={{ flex: 1 - sliderFlexAmount }} />
            {!disabled &&
              <View
                style={[styles.sliderButton, { left: sliderLocation -  BUTTON_MIDDLE_SIZE}]}
              >
                <View style={styles.insideSliderButton} />
              </View>}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

AmountPicker.propTypes = {
  amount: PropTypes.number,
  disabled: PropTypes.bool,
  onSelect: PropTypes.func,
};

export default AmountPicker;
