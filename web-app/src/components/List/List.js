import React, { Component } from 'react';
import Infinite from 'react-infinite';
import PropTypes from 'prop-types';
import './List.css';

class List extends Component {
  getWindowHeight = () =>
      (window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight) - 50;
  render() {
    const { headerContent, infinite, onInfiniteLoad, items } = this.props;
    if (infinite) {
      return (
        <Infinite
          containerHeight={this.getWindowHeight()}
          onInfiniteLoad={onInfiniteLoad}
          className="List"
          elementHeight={90}
          infiniteLoadBeginEdgeOffset={300}
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
};
List.propTypes = {
  headerContent: PropTypes.element,
  items: PropTypes.array.isRequired,
  infinite: PropTypes.bool,
  onInfiniteLoad: PropTypes.func,
};

export default List;
