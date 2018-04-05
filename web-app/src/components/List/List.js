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
    const paddingTop = (headerContent ? 80 : 0);
    const containerHeight = this.getWindowHeight() - paddingTop;
    if (infinite) {
      const infiniteList = (
        <Infinite
          containerHeight={containerHeight}
          onInfiniteLoad={onInfiniteLoad}
          className='List'
          elementHeight={this.props.elementHeight}
          infiniteLoadBeginEdgeOffset={200}
        >
          {items}
        </Infinite>
      );
      if (!headerContent) {
        return infiniteList;
      }
      return (
        <div style={{ position: 'relative',  paddingTop}}>
          <div style={{ position: 'absolute', top: 0, left: 0 }}>
            {headerContent}
          </div>
          {infiniteList}
        </div>
      );
    }
    return (
      <div className="List">
        {headerContent}
        <div className="Team-List">
          {items.map(item => item)}
          </div>
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
