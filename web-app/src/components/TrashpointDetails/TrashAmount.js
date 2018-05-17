import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { AMOUNT_STATUSES } from '../../shared/constants';
import {
  AMOUNT_PICKER_IMAGES,
  TOGGLE_TYPE,
} from '../../shared/trashpoint-constants';
import './TrashAmount.css';

const GradationBall = ({ flexValue }) => {
  const styles = {
    backgroundColor: '#3e8ede',
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
};

GradationBall.propTypes = {
  flexValue: PropTypes.number.isRequired,
};

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

ImageToggleContainer.propTypes = {
  onClick: PropTypes.func.isRequired,
  flexValue: PropTypes.number.isRequired,
  translationValue: PropTypes.number.isRequired,
  children: PropTypes.any.isRequired,
};

const ImageToggle = ({ selected, type }) => {
  const imageRef = `${type}_${'BLUE'}_${selected
    ? 'FILL'
    : 'OUTLINE'}`;

  const { source, style } = AMOUNT_PICKER_IMAGES[imageRef];
  style.alignSelf = 'flex-end';

  return <img src={source} style={style} alt="" />;
};

ImageToggle.propTypes = {
  selected: PropTypes.bool,
  type: PropTypes.string.isRequired,
};

ImageToggle.defaultProps = {
  selected: false,
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
          <div className="completer-wrapper">
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

TrashAmount.defaultProps = {
  amount: '',
  disabled: false,
  onSelect: () => {},
};

export default TrashAmount;
