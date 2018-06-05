import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { actions, selectors } from '../../reducers/events';
import {
  TrashpointList,
} from '../../components/Events/EventTrashpointList/TrashpointList';

class EventTrashpointList extends Component {

  static propTypes = {
    fetchEventDetails: PropTypes.func.isRequired,
    eventDetails: PropTypes.any.isRequired,
    eventId: PropTypes.string,
  };

  static defaultProps = {
    eventId: '',
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
    const { eventDetails, eventId } = this.props;
    const { trashpoints } = eventDetails;
    return (
      <TrashpointList
        eventId={eventId}
        trashpoints={trashpoints}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  eventDetails: selectors.getEventDetails(state),
});

const mapDispatchToProps = {
  fetchEventDetails: actions.fetchEventDetails,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EventTrashpointList);
