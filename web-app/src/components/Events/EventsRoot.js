import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import EventListHeader from './EventListHeader';
import './Events.css';

class EventsRoot extends Component {

  static propTypes = {
    toggleEventWindow: PropTypes.func.isRequired,
    isOpened: PropTypes.bool.isRequired,
    updateSearchResultViewport: PropTypes.func.isRequired,
    history: PropTypes.any,
    children: PropTypes.any.isRequired,
  };

  static defaultProps = {
    history: null,
  };

  render() {
    const {
      toggleEventWindow,
      history,
      updateSearchResultViewport,
      isOpened,
      children,
    } = this.props;

    return (
      <div className="EventsList-container">
        <EventListHeader
          onMinimizeClick={toggleEventWindow}
          updateSearchResultViewport={updateSearchResultViewport}
          history={history}
        />
        <div className={classnames('EventsList-plot', { visible: isOpened })}>
          { children }
        </div>
      </div>
    );
  }
}

export default EventsRoot;
