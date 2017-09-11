import React, { Component } from 'react';
import Infinite from 'react-infinite';
import PropTypes from 'prop-types';
import './List.css';

class List extends Component {
  getWindowHeight = () =>
      (window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight);
  render() {
    const { headerContent, infinite, onInfiniteLoad, items } = this.props;
    if (infinite) {
      return (
        <Infinite
          containerHeight={this.getWindowHeight()}
          onInfiniteLoad={onInfiniteLoad}
          className="List"
          elementHeight={this.props.elementHeight}
          infiniteLoadBeginEdgeOffset={200}
        >
          {items}
        </Infinite>
      );
    }
    return (
      <div className="List">
        {headerContent}
        {items.map(item => item)}
      </div>
    );
  }
}
List.defaultProps = {
  headerContent: null,
  infinite: false,
  onInfiniteLoad: undefined,
  elementHeight: 90,
};
List.propTypes = {
  headerContent: PropTypes.element,
  items: PropTypes.array.isRequired,
  infinite: PropTypes.bool,
  onInfiniteLoad: PropTypes.func,
  elementHeight: PropTypes.number,
};

export default List;
