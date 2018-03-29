import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { actions, selectors } from '../../reducers/events';
import {
  actions as appActions,
  selectors as appSelectors,
} from '../../reducers/app';
import { List } from '../../components/EventsList';

class EventsList extends Component {
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
    if (nextProps.eventId && nextProps.eventId !== this.props.eventId) {
      this.props.fetchEventDetails(nextProps.eventId);
    }
    document.getElementsByClassName('EventsList-plot')[0].scrollTop = 0;
  }

  render() {
    return (
      <List {...this.props} />
    );
  }
}

EventsList.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
  fetchEventsList: PropTypes.func.isRequired,
  fetchEventDetails: PropTypes.func.isRequired,
  eventId: PropTypes.string,
};

EventsList.defaultProps = {
  eventId: '',
};

const mapStateToProps = (state) => ({
  events: selectors.getEventsList(state),
  eventDetails: selectors.getEventDetails(state),
  isOpened: selectors.getShowEventWindow(state),
  currentLocation: appSelectors.getCurrentLocation(state),
});

const mapDispatchToProps = {
  toggleEventWindow: actions.toggleEventWindow,
  fetchEventsList: actions.fetchEventsList,
  fetchEventDetails: actions.fetchEventDetails,
  setActiveTab: appActions.setActiveTab,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);
