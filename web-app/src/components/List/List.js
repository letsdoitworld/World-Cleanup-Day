import React, { Component } from 'react';
import Infinite from 'react-infinite';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { EmptyUsersState } from './EmptyState';
import { Loader } from '../Spinner';
import './List.css';

class List extends Component {
  state = {
    firstLoadPass: false,
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading && !this.state.firstLoadPass) {
      this.setState({ firstLoadPass: true });
    }
  }

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
      loading,
    } = this.props;
    const paddingTop = (headerContent ? 40 : 0);
    const containerHeight = this.getWindowHeight() - paddingTop;
    if (infinite) {
      const infiniteList = (
        loading && !this.state.firstLoadPass ?
          <Loader /> :
          (<Infinite
            containerHeight={containerHeight}
            onInfiniteLoad={onInfiniteLoad}
            className={
              classnames(
                'UsersList-plot',
                'scrollbar-modified',
                { isVisible: userslistWindowVisible })
              }
            elementHeight={this.props.elementHeight}
            infiniteLoadBeginEdgeOffset={200}
          >
            {
              items.length ?
                items :
                <EmptyUsersState />
            }
          </Infinite>)
      );
      if (!headerContent) {
        return infiniteList;
      }
      return (
        <div className="UsersList-container">
          {headerContent}
          {
              infiniteList
          }
        </div>
      );
    }
    return (
      <div className="UsersList-container">
        {headerContent}
        <div className={
          classnames(
            'UsersList-plot',
            'scrollbar-modified',
            { isVisible: userslistWindowVisible })
          }
        >
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
  loading: false,
};

List.propTypes = {
  headerContent: PropTypes.element,
  items: PropTypes.any.isRequired,
  infinite: PropTypes.bool,
  userslistWindowVisible: PropTypes.bool.isRequired,
  onInfiniteLoad: PropTypes.func,
  elementHeight: PropTypes.number,
  loading: PropTypes.bool,
};

export default List;
