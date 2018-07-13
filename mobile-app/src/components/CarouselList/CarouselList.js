import React from 'react';
import Carousel from 'react-native-snap-carousel';
import PropTypes from 'prop-types';
import styles from './styles';

const CarouselList = (props) => {
  return (
    <Carousel
      containerCustomStyle={[styles.carouselListStyle, { width: props.widthScreen }]}
      ref={ref => props.onRef(ref)}
      data={props.list}
      renderItem={({ item }) => { return props.renderCarouselItem(item); }}
      inactiveSlideScale={0.85}
      inactiveSlideOpacity={0.7}
      sliderWidth={props.widthScreen}
      itemWidth={props.widthScreen - 37 * 2}
      onSnapToItem={index => props.onSnapToItem(index, props.list)}
    />
  );
};

CarouselList.propTypes = {
  list: PropTypes.array,
  renderCarouselItem: PropTypes.func,
  onSnapToItem: PropTypes.func,
  onRef: PropTypes.func,
};

export default CarouselList;
