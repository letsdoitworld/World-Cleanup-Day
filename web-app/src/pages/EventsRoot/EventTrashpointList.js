import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { actions, selectors } from '../../reducers/events';
import {
  actions as appActions,
  selectors as appSelectors,
} from '../../reducers/app';
import { TrashpointList } from '../../components/Events/EventTrashpointList/TrashpointList';

class EventTrashpointList extends Component {

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
    this.props.fetchEventDetails(this.props.eventId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.eventId && nextProps.eventId !== this.props.eventId) {
      this.props.fetchEventDetails(nextProps.eventId);
    }
  }

  render() {
    const { eventDetails } = this.props;
    console.log('eventDetails', eventDetails);
    return (
      <TrashpointList trashpoints={eventDetails.trashpoints} />
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

export default connect(mapStateToProps, mapDispatchToProps)(EventTrashpointList);
