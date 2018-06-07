import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { actions, selectors } from '../../reducers/events';
import {
  actions as appActions,
  selectors as appSelectors,
} from '../../reducers/app';
import { Events } from '../../components/Events';
import EventListHeader from '../../components/Events/EventListHeader';

class EventsRoot extends Component {

  static propTypes = {
    setActiveTab: PropTypes.func.isRequired,
    isOpened: PropTypes.bool,
    shareModalOpened: PropTypes.bool,
    fetchEventsList: PropTypes.func.isRequired,
    expandEventWindow: PropTypes.func.isRequired,
    children: PropTypes.any.isRequired,
  };

  static defaultProps = {
    isOpened: false,
    shareModalOpened: false,
  };

  componentWillMount() {
    this.props.setActiveTab('events');
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isOpened) {
      this.props.expandEventWindow();
    }
    if (nextProps.shareModalOpened) {
      document.getElementsByClassName('EventsList-container')[0].style.zIndex = 12;
    } else {
      document.getElementsByClassName('EventsList-container')[0].style.zIndex = 9;
    }
    document.getElementsByClassName('EventsList-plot')[0].scrollTop = 0;
  }

  render() {
    return (
      <Events {...this.props} />
    );
  }
}

const mapStateToProps = (state) => ({
  isOpened: selectors.getShowEventWindow(state),
  shareModalOpened: appSelectors.getShowShareModal(state),
});

const mapDispatchToProps = {
  toggleEventWindow: actions.toggleEventWindow,
  expandEventWindow: actions.expandEventWindow,
  fetchEventsList: actions.fetchEventsList,
  updateSearchResultViewport: actions.updateSearchResultViewport,
  setActiveTab: appActions.setActiveTab,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsRoot);
