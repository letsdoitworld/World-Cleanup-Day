import React, { Component } from 'react';
import Infinite from 'react-infinite';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { EmptyUsersState } from './EmptyState';
import './List.css';

class List extends Component {
  getWindowHeight = () =>
    (window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight);

  render() {
    const {
      headerContent,
      infinite,
      onInfiniteLoad,
      items,
      userslistWindowVisible,
    } = this.props;
    const paddingTop = (headerContent ? 40 : 0);
    const containerHeight = this.getWindowHeight() - paddingTop;
    if (infinite) {
      const infiniteList = items.length ? (
        <Infinite
          containerHeight={containerHeight}
          onInfiniteLoad={onInfiniteLoad}
          className={
            classnames(
              'UsersList-plot',
              { isVisible: userslistWindowVisible })
            }
          elementHeight={this.props.elementHeight}
          infiniteLoadBeginEdgeOffset={200}
        >
          {items}
        </Infinite>
      ) : <EmptyUsersState />;
      if (!headerContent) {
        return infiniteList;
      }
      return (
        <div className="UsersList-container">
          {headerContent}
          {infiniteList}
        </div>
      );
    }
    return (
      <div className="UsersList-container">
        {headerContent}
        <div className={
          classnames(
            'UsersList-plot',
            { isVisible: userslistWindowVisible })
          }
        >
          {items.map(item => item)}
          <EmptyUsersState />
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
  userslistWindowVisible: PropTypes.bool.isRequired,
  onInfiniteLoad: PropTypes.func,
  elementHeight: PropTypes.number,
};

export default List;
