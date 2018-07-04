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
    targetId: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    targetId: '',
  };

  componentWillMount() {
    this.props.fetchEventDetails(this.props.targetId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.targetId && nextProps.targetId !== this.props.targetId) {
      this.props.fetchEventDetails(nextProps.targetId);
    }
  }

  render() {
    const { eventDetails, targetId, isLoading } = this.props;
    const { trashpoints } = eventDetails;
    return (
      <TrashpointList
        targetId={targetId}
        targetSection={'event'}
        trashpoints={trashpoints}
        isLoading={isLoading}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  eventDetails: selectors.getEventDetails(state),
  isLoading: selectors.getEventDetailsLoading(state),
});

const mapDispatchToProps = {
  fetchEventDetails: actions.fetchEventDetails,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EventTrashpointList);
