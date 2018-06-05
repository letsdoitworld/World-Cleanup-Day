import React from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

export const TOGGLE_TYPE = {
  handful: 'HANDFUL',
  bagful: 'BAGFUL',
  cartload: 'CARTLOAD',
  truck: 'TRUCK',
};

const AMOUNT_PICKER_IMAGES = {
  BAGFUL_BLUE_FILL: {
    source: require('../../images/icon_bagful_blue_fill.png'),
    style: { width: 20 },
  },
  BAGFUL_BLUE_OUTLINE: {
    source: require('../../images/icon_bagful_blue_outline.png'),
    style: { width: 20 },
  },
  BAGFUL_GREY_FILL: {
    source: require('../../images/icon_bagful_grey_fill.png'),
    style: { width: 20 },
  },
  BAGFUL_GREY_OUTLINE: {
    source: require('../../images/icon_bagful_grey_outline.png'),
    style: { width: 20 },
  },
  HANDFUL_BLUE_FILL: {
    source: require('../../images/icon_handful_blue_fill.png'),
    style: { width: 28 },
  },
  HANDFUL_BLUE_OUTLINE: {
    source: require('../../images/icon_handful_blue_outline.png'),
    style: { width: 28 },
  },
  HANDFUL_GREY_FILL: {
    source: require('../../images/icon_handful_grey_fill.png'),
    style: { width: 28 },
  },
  HANDFUL_GREY_OUTLINE: {
    source: require('../../images/icon_handful_grey_outline.png'),
    style: { width: 28 },
  },
  CARTLOAD_BLUE_FILL: {
    source: require('../../images/icon_cartload_blue_fill.png'),
    style: { width: 28 },
  },
  CARTLOAD_BLUE_OUTLINE: {
    source: require('../../images/icon_cartload_blue_outline.png'),
    style: { width: 28 },
  },
  CARTLOAD_GREY_FILL: {
    source: require('../../images/icon_cartload_grey_fill.png'),
    style: { width: 28 },
  },
  CARTLOAD_GREY_OUTLINE: {
    source: require('../../images/icon_cartload_grey_outline.png'),
    style: { width: 28 },
  },
  TRUCK_BLUE_FILL: {
    source: require('../../images/icon_truck_blue_fill.png'),
    style: { width: 33 },
  },
  TRUCK_BLUE_OUTLINE: {
    source: require('../../images/icon_truck_blue_outline.png'),
    style: { width: 33 },
  },
  TRUCK_GREY_FILL: {
    source: require('../../images/icon_truck_grey_fill.png'),
    style: { width: 33 },
  },
  TRUCK_GREY_OUTLINE: {
    source: require('../../images/icon_truck_grey_outline.png'),
    style: { width: 33 },
  },
};

const ImageToggle = ({ selected, type, disabled }) => {
  const imageRef = `${type}_${disabled ? 'GREY' : 'BLUE'}_${selected
    ? 'FILL'
    : 'OUTLINE'}`;

  const { source, style } = AMOUNT_PICKER_IMAGES[imageRef];

  return <Image resizeMode="contain" source={source} style={style} />;
};

ImageToggle.propTypes = {
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.any,
};

export default ImageToggle;
