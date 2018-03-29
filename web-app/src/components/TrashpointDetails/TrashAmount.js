import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import bagfullBlueFill from './images/icon_bagful_blue_fill@2x.png';
import bagfullBlueOutline from './images/icon_bagful_blue_outline@2x.png';
import bagfullGreyFill from './images/icon_bagful_grey_fill@2x.png';
import bagfullGreyOutline from './images/icon_bagful_grey_outline@2x.png';
import cartloadBlueFill from './images/icon_cartload_blue_fill@2x.png';
import cartloadBlueOutline from './images/icon_cartload_blue_outline@2x.png';
import cartloadGreyFill from './images/icon_cartload_grey_fill@2x.png';
import cartloadGreyOutline from './images/icon_cartload_grey_outline@2x.png';
import handfulBlueFill from './images/icon_handful_blue_fill@2x.png';
import handfulBlueOutline from './images/icon_handful_blue_outline@2x.png';
import handfulGreyFill from './images/icon_handful_grey_fill@2x.png';
import handfulGreyOutline from './images/icon_handful_grey_outline@2x.png';
import truckBlueFill from './images/icon_truck_blue_fill@2x.png';
import truckBlueOutline from './images/icon_truck_blue_outline@2x.png';
import truckGreyFill from './images/icon_truck_grey_fill@2x.png';
import truckGreyOutline from './images/icon_truck_grey_outline@2x.png';
import './TrashAmount.css';

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

const GradationBall = ({ flexValue, disabled = false }) => {
  const styles = {
    backgroundColor: disabled ? '#d9d9d9' : '#3e8ede',
    width: '8px',
    height: '8px',
    borderRadius: '6px',
    float: 'right',
    position: 'relative',
    left: '3px',
  };
  return (
    <div style={{ flex: flexValue }}>
      <div style={styles} />
    </div>
  );
}

const ImageToggleContainer = ({
  onClick,
  flexValue,
  translationValue,
  children,
}) => {
  const styles = {
    display: 'flex',
    flex: flexValue,
    justifyContent: 'flex-end',
    transform: `translateX(${translationValue}px)`,
  };
  return (
    <div onClick={onClick} style={styles}>
      {children}
    </div>
  );
};

export const TOGGLE_TYPE = {
  handful: 'HANDFUL',
  bagful: 'BAGFUL',
  cartload: 'CARTLOAD',
  truck: 'TRUCK',
};

const AMOUNT_PICKER_IMAGES = {
  BAGFUL_BLUE_FILL: {
    source: bagfullBlueFill,
    style: { width: '20px' },
  },
  BAGFUL_BLUE_OUTLINE: {
    source: bagfullBlueOutline,
    style: { width: '20px' },
  },
  BAGFUL_GREY_FILL: {
    source: bagfullGreyFill,
    style: { width: '20px' },
  },
  BAGFUL_GREY_OUTLINE: {
    source: bagfullGreyOutline,
    style: { width: '20px' },
  },
  HANDFUL_BLUE_FILL: {
    source: handfulBlueFill,
    style: { width: '28px' },
  },
  HANDFUL_BLUE_OUTLINE: {
    source: handfulBlueOutline,
    style: { width: '28px' },
  },
  HANDFUL_GREY_FILL: {
    source: handfulGreyFill,
    style: { width: '28px' },
  },
  HANDFUL_GREY_OUTLINE: {
    source: handfulGreyOutline,
    style: { width: '28px' },
  },
  CARTLOAD_BLUE_FILL: {
    source: cartloadBlueFill,
    style: { width: '28px' },
  },
  CARTLOAD_BLUE_OUTLINE: {
    source: cartloadBlueOutline,
    style: { width: '28px' },
  },
  CARTLOAD_GREY_FILL: {
    source: cartloadGreyFill,
    style: { width: '28px' },
  },
  CARTLOAD_GREY_OUTLINE: {
    source: cartloadGreyOutline,
    style: { width: '28px' },
  },
  TRUCK_BLUE_FILL: {
    source: truckBlueFill,
    style: { width: '33px' },
  },
  TRUCK_BLUE_OUTLINE: {
    source: truckBlueOutline,
    style: { width: '33px' },
  },
  TRUCK_GREY_FILL: {
    source: truckGreyFill,
    style: { width: '33px' },
  },
  TRUCK_GREY_OUTLINE: {
    source: truckGreyOutline,
    style: { width: '33px' },
  },
};

const ImageToggle = ({ selected, type, disabled }) => {
  const imageRef = `${type}_${disabled ? 'GREY' : 'BLUE'}_${selected
    ? 'FILL'
    : 'OUTLINE'}`;

  const { source, style } = AMOUNT_PICKER_IMAGES[imageRef];
  style.alignSelf = 'flex-end';

  return <img src={source} style={style} alt="" />;
};

ImageToggle.propTypes = {
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  imageSelected: PropTypes.any,
  imageUnselected: PropTypes.any,
  customStyles: PropTypes.any,
};

class TrashAmount extends Component {
  constructor(props) {
    super(props);

    const { amount } = props;

    let steps = [
      {
        selected: false,
        flexValue: 0.125,
        value: AMOUNT_STATUSES[0],
        type: TOGGLE_TYPE.handful,
        label: 'Handful',
        imgTranslate: 14,
      },
      {
        selected: false,
        flexValue: 0.25,
        value: AMOUNT_STATUSES[1],
        type: TOGGLE_TYPE.bagful,
        label: 'Bagful',
        imgTranslate: 10,
      },
      {
        selected: false,
        flexValue: 0.25,
        value: AMOUNT_STATUSES[2],
        type: TOGGLE_TYPE.cartload,
        label: 'Cartload',
        imgTranslate: 14,
      },
      {
        selected: false,
        flexValue: 0.25,
        value: AMOUNT_STATUSES[3],
        type: TOGGLE_TYPE.truck,
        label: 'Truck',
        imgTranslate: 16.5,
      },
    ];
    if (amount) {
      steps = this.updateSelectedSteps(amount, steps);
    }

    this.state = {
      steps,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.amount !== nextProps.amount) {
      this.setState({
        steps: this.updateSelectedSteps(nextProps.amount, this.state.steps),
      });
    }
  }
  getLastSelected = () => _.findLast(this.state.steps, s => !!s.selected);
  updateSelectedSteps = (amount, steps) => {
    const selectedIndex = AMOUNT_STATUSES[amount];
    return steps.map((step, index) => ({
      ...step,
      selected: selectedIndex >= index,
      lastSelected: selectedIndex === index,
    }));
  };

  handlePress = selectedValue => {
    if (this.props.disabled) {
      return;
    }

    this.setState(
      {
        steps: this.updateSelectedSteps(selectedValue, this.state.steps),
      },
      () => this.props.onSelect && this.props.onSelect(selectedValue),
    );
  };

  render() {
    const { steps } = this.state;
    const [first, second, third, fourth] = steps;
    const { disabled } = this.props;
    const lastSelected = this.getLastSelected();

    return (
      <div className="TrashAmount">
        <span className="TrashAmount-title">
          {disabled ? 'Trash amount' : 'Select trash amount'}
        </span>
        <div className="TrashAmount-plot">
          <div className="TrashAmount-container-images">
            {this.state.steps.map(step =>
              (<ImageToggleContainer
                onClick={() => this.handlePress(step.value)}
                translationValue={step.imgTranslate}
                key={step.value}
                flexValue={step.flexValue}
              >
                <ImageToggle
                  selected={step.selected}
                  type={step.type}
                  disabled={disabled}
                />
              </ImageToggleContainer>),
            )}
            <div
              className="completer"
              onClick={() => this.handlePress(fourth.value)}
            />
          </div>
          <div style={{ display: 'flex', marginTop: '15px' }}>
            <div
              className="completer"
              onClick={() => this.handlePress(fourth.value)}
            />
          </div>

          <div className="TouchableChildContainer">
            {steps.map((step, index) =>
              (<div
                key={step.value}
                onClick={() => this.handlePress(step.value)}
                style={{ flex: step.flexValue }}
                className={classnames({
                  'BarContainer-first': index === 0,
                  BarContainer: step.selected,
                  'BarContainer-disabled': disabled,
                  'BarContainer-last':
                    step.type !== TOGGLE_TYPE.truck && step.lastSelected,
                })}
              >
                <GradationBall
                  key={step.value}
                  flexValue={step.flexValue}
                  disabled={disabled}
                />
                {
                  !disabled &&
                  step.lastSelected &&
                  <div className="SliderButton">
                    <div className="InsideSliderButton" />
                  </div>
                }
              </div>),
            )}
            <div
              className={classnames('completer', {
                disabled,
                filled: fourth.selected,
              })}
              onClick={() => this.handlePress(fourth.value)}
            />
          </div>
          <div className="TrashAmount-types">
            {steps.map(step =>
              (
                <span
                  key={step.label}
                  className={
                    classnames('TrashAmount-types-text',
                    { selected: step.label === lastSelected.label })
                  }
                >
                  {step.label}
                </span>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

TrashAmount.propTypes = {
  amount: PropTypes.string,
  disabled: PropTypes.bool,
  onSelect: PropTypes.func,
};

export default TrashAmount;
