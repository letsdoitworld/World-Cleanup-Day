import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { actions, selectors } from '../../reducers/events';
import {
  selectors as appSelectors,
  actions as appActions,
} from '../../reducers/app';
import { Details } from '../../components/Events/EventDetails';

class EventsDetails extends Component {

  static propTypes = {
    fetchEventDetails: PropTypes.func.isRequired,
    eventDetails: PropTypes.any.isRequired,
    eventId: PropTypes.string,
    showShareModal: PropTypes.func,
  };

  static defaultProps = {
    eventId: '',
    showShareModal: null,
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
    const { eventDetails, showShareModal } = this.props;
    return (
      <Details eventDetails={eventDetails} showShareModal={showShareModal} />
    );
  }
}

const mapStateToProps = (state) => ({
  eventDetails: selectors.getEventDetails(state),
  shareModalOpened: appSelectors.getShowShareModal(state),
});

const mapDispatchToProps = {
  fetchEventDetails: actions.fetchEventDetails,
  showShareModal: appActions.showShareModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsDetails);
