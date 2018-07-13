/* eslint-disable react/jsx-no-bind */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image,
  TouchableWithoutFeedback } from 'react-native';
import styles from './styles';
import { FollowingButton, ButtonAdd } from '../../assets/images';

export default class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.background = undefined;
    this.plus = undefined;

    this.state = { checked: this.props.checked
        !== undefined ? this.props.checked : false };
  }


  componentWillReceiveProps(nextProps) {
    this.setState({ checked: nextProps.checked
        !== undefined ? nextProps.checked : false });
  }

    onPressCheck = () => {
      this.setState({ checked: !this.state.checked });

      if (this.props.onCheckedChanged) {
        this.props.onCheckedChanged(!this.state.checked);
      }
    };

    render() {
      let image;

      if (this.state.checked) {
        image = FollowingButton;
      } else {
        image = ButtonAdd;
      }

      return (
        <TouchableWithoutFeedback
          disabled={this.props.disabled}
          style={[styles.imageContainer, this.props.style]}
          onPress={this.onPressCheck.bind(this)}
        >
          <Image
            source={image}
            style={this.props.style}
          />
        </TouchableWithoutFeedback>
      );
    }
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  style: PropTypes.any,
  disabled: PropTypes.bool,
  onCheckedChanged: PropTypes.func,
};
