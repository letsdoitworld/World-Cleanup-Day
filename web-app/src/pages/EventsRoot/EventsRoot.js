import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { actions, selectors } from '../../reducers/events';
import {
  actions as appActions,
  selectors as appSelectors,
} from '../../reducers/app';
import { Events } from '../../components/Events';

class EventsRoot extends Component {

  static propTypes = {
    setActiveTab: PropTypes.func.isRequired,
    isOpened: PropTypes.bool,
    shareModalOpened: PropTypes.bool,
    fetchEventsList: PropTypes.func.isRequired,
    fetchEventDetails: PropTypes.func.isRequired,
    expandEventWindow: PropTypes.func.isRequired,
    eventId: PropTypes.string,
    isTrashpointList: PropTypes.bool,
    trashpointId: PropTypes.string,
    children: PropTypes.any.isRequired,
  };

  static defaultProps = {
    eventId: '',
    isTrashpointList: false,
    trashpointId: '',
    isOpened: false,
    shareModalOpened: false,
  };

  componentWillMount() {
    this.props.setActiveTab('events');
    if (!this.props.eventId) {
      this.props.fetchEventsList(50, 1);
    }
    if (this.props.eventId) {
      this.props.fetchEventDetails(this.props.eventId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isOpened) {
      this.props.expandEventWindow();
    }
    if (nextProps.eventId && nextProps.eventId !== this.props.eventId) {
      this.props.fetchEventDetails(nextProps.eventId);
    }
    if (!nextProps.eventId && nextProps.eventId !== this.props.eventId) {
      const itemsPerPage = 50;
      const pageNumber = 1;
      this.props.fetchEventsList(itemsPerPage, pageNumber);
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
      <Events {...this.props}>
        {this.props.children}
      </Events>
    );
  }
}

const mapStateToProps = (state) => ({
  events: selectors.getEventsList(state),
  eventDetails: selectors.getEventDetails(state),
  isOpened: selectors.getShowEventWindow(state),
  shareModalOpened: appSelectors.getShowShareModal(state),
  currentLocation: appSelectors.getCurrentLocation(state),
});

const mapDispatchToProps = {
  toggleEventWindow: actions.toggleEventWindow,
  expandEventWindow: actions.expandEventWindow,
  showShareModal: appActions.showShareModal,
  fetchEventsList: actions.fetchEventsList,
  fetchEventDetails: actions.fetchEventDetails,
  setActiveTab: appActions.setActiveTab,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsRoot);
