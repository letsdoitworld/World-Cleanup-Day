/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';
import Chip from './Chip';

const style = {
  backgroundColor: 'white',
  flexDirection: 'row',
  flexWrap: 'wrap',
  padding: 10,
};

export default class Chips extends Component {
  renderChips() {
    let key = 0;
    return this.props.types.map(type =>
      <Chip
        text={type}
        key={key++}
      />,
    );
  }

  render() {
    return (
      <View style={style}>
        {this.renderChips()}
      </View>
    );
  }
}

Chips.propTypes = {
  types: PropTypes.any,
};
