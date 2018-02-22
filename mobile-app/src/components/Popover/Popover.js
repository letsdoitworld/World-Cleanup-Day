import React, { Component } from 'react';
import { View, Modal, Animated, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import { SCREEN_WIDTH } from '../../shared/constants';
import {
  isAndroid,
  getHeightPercentage,
  getWidthPercentage,
} from '../../shared/helpers';
import { WHITE_COLOR } from '../../shared/constants';

const CIRCLE_OUTLINE_SIZE = getHeightPercentage(24);
const POPOVER_TOP_POSITION = getHeightPercentage(isAndroid() ? 73 : 50);

class PopoverTooltip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      opacity: new Animated.Value(0),
      tooltip_container_scale: new Animated.Value(0),
      tooptip_triangle_down: true,
      tooltip_triangle_left_margin: 0,
      will_popup: false,
    };
  }

  componentWillMount() {
    const oppositeOpacity = this.state.opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

    this.setState(
      { opposite_opacity: oppositeOpacity },
      () => this.props.show && this.toggle(),
    );
  }

  toggleModal = () => {
    this.setState(
      { isModalOpen: !this.state.isModalOpen },
      () => !this.state.isModalOpen && this.props.onRequestClose(),
    );
  };

  openModal = () => {
    const { onOpenTooltipMenu } = this.props;
    this.setState({ will_popup: true });
    this.toggleModal();
    onOpenTooltipMenu && onOpenTooltipMenu();
  };

  hideModal = () => {
    const { onCloseTooltipMenu } = this.props;
    this.setState({ will_popup: false });
    this._showZoomingOutAnimation();
    onCloseTooltipMenu && onCloseTooltipMenu();
  };

  toggle = () => {
    this.state.isModalOpen ? this.hideModal() : this.openModal();
  };

  handleOnLayout = ({ nativeEvent }) => {
    let tooltip_container_width = nativeEvent.layout.width;
    let tooltip_container_height = nativeEvent.layout.height;
    const { tooltip_container_scale, will_popup } = this.state;

    if (
      will_popup &&
      tooltip_container_width > 0 &&
      tooltip_container_height > 0
    ) {
      this._component_wrapper.measure((x, y, width, height, pageX, pageY) => {
        let tooltip_container_x_final = pageX +
          tooltip_container_width +
          (width - tooltip_container_width) / 2 >
          SCREEN_WIDTH
          ? SCREEN_WIDTH - tooltip_container_width
          : pageX + (width - tooltip_container_width) / 2;
        let tooltip_container_y_final =
          pageY - tooltip_container_height - POPOVER_TOP_POSITION;
        let tooltip_triangle_down = true;

        if (pageY - tooltip_container_height - POPOVER_TOP_POSITION < 0) {
          tooltip_container_y_final = pageY + height + POPOVER_TOP_POSITION;
          tooltip_triangle_down = false;
        }

        let tooltip_container_x = tooltip_container_scale.interpolate({
          inputRange: [0, 1],
          outputRange: [tooltip_container_x_final, tooltip_container_x_final],
        });

        let tooltip_container_y = tooltip_container_scale.interpolate({
          inputRange: [0, 1],
          outputRange: [
            tooltip_container_y_final +
              tooltip_container_height / 2 +
              POPOVER_TOP_POSITION,
            tooltip_container_y_final,
          ],
        });

        let tooltip_triangle_left_margin =
          pageX +
          width / 2 -
          tooltip_container_x_final -
          getWidthPercentage(10);

        this.setState(
          {
            x: pageX,
            y: pageY,
            width,
            height,
            tooltip_container_x,
            tooltip_container_y,
            tooltip_triangle_down,
            tooltip_triangle_left_margin,
          },
          () => this._showZoomingInAnimation(),
        );
      });

      this.setState({ will_popup: false });
    }
  };

  _showZoomingOutAnimation = () => {
    const { tooltip_container_scale, opacity } = this.state;
    const animationFinalValue = {
      toValue: 0,
      duration: this.props.opacityChangeDuration || 200,
    };

    Animated.parallel([
      Animated.timing(tooltip_container_scale, animationFinalValue),
      Animated.timing(opacity, animationFinalValue),
    ]).start(this.toggleModal);
  };

  _showZoomingInAnimation = () => {
    const { tooltip_container_scale, opacity } = this.state;

    const {
      timingConfig,
      animationType,
      springConfig,
      opacityChangeDuration,
    } = this.props;

    let tooltip_animation = Animated.timing(tooltip_container_scale, {
      toValue: 1,
      duration: timingConfig && timmingConfig.duration
        ? timmingConfig.duration
        : 200,
    });

    if (animationType === 'spring') {
      tooltip_animation = Animated.spring(tooltip_container_scale, {
        toValue: 1,
        tension: springConfig && springConfig.tension
          ? springConfig.tension
          : 100,
        friction: springConfig && springConfig.friction
          ? springConfig.friction
          : 7,
      });
    }

    Animated.parallel([
      tooltip_animation,
      Animated.timing(opacity, {
        toValue: 1,
        duration: opacityChangeDuration || 200,
      }),
    ]).start();
  };

  render() {
    const {
      componentWrapperStyle,
      overlayStyle,
      tooltipContainerStyle,
      children,
    } = this.props;

    const {
      isModalOpen,
      opacity,
      tooltip_container_scale,
      tooltip_triangle_left_margin,
      tooltip_triangle_down,
      tooltip_container_x,
      tooltip_container_y,
    } = this.state;

    let buttonStyles = {};

    return (
      <TouchableOpacity
        ref={component => (this._component_wrapper = component)}
        style={[componentWrapperStyle]}
        onPress={this.toggle}
        activeOpacity={1.0}
      >
        <Modal visible={isModalOpen} transparent onRequestClose={() => {}}>
          <Animated.View style={[styles.overlay, overlayStyle, { opacity }]}>
            <TouchableOpacity
              activeOpacity={1}
              focusedOpacity={1}
              style={{ flex: 1 }}
              onPress={this.toggle}
            >
              <Animated.View
                style={[
                  styles.tooltipContainer,
                  tooltipContainerStyle,
                  {
                    left: tooltip_container_x,
                    top: tooltip_container_y,
                    transform: [{ scale: tooltip_container_scale }],
                  },
                ]}
              >

                <View
                  onLayout={this.handleOnLayout}
                  style={[
                    {
                      backgroundColor: 'transparent',
                      alignItems: 'flex-start',
                    },
                  ]}
                >
                  <View style={styles.contentWrapper}>
                    {children}
                  </View>
                  {tooltip_triangle_down &&
                    <View
                      style={[
                        styles.triangle_down,
                        { marginLeft: tooltip_triangle_left_margin },
                      ]}
                    />}
                </View>
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.toggle}>
              <View style={styles.highlightedButtonStyles}>
                <IconIO
                  name={'ios-add-circle-outline'}
                  size={CIRCLE_OUTLINE_SIZE}
                  color={WHITE_COLOR}
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Modal>
      </TouchableOpacity>
    );
  }
}

PopoverTooltip.propTypes = {
  componentWrapperStyle: PropTypes.object,
  overlayStyle: PropTypes.object,
  labelContainerStyle: PropTypes.object,
  labelStyle: PropTypes.object,
  animationType: PropTypes.oneOf(['timing', 'spring']),
  show: PropTypes.bool,
};

PopoverTooltip.defaultProps = {
  onRequestClose: () => {},
  delayLongPress: 100,
};

export default PopoverTooltip;
