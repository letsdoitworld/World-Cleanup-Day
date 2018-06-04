import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { actions, selectors } from '../../reducers/events';
import {
  selectors as appSelectors,
} from '../../reducers/app';
import { List } from '../../components/Events/EventsList';

class EventsList extends Component {

  static propTypes = {
    fetchEventsList: PropTypes.func.isRequired,
    events: PropTypes.any.isRequired,
    rectangle: PropTypes.shape({
      nw: PropTypes.shape({
        latitude: PropTypes.number,
        longitude: PropTypes.number,
      }),
      se: PropTypes.shape({
        latitude: PropTypes.number,
        longitude: PropTypes.number,
      }),
    }),
  };

  static defaultProps = {
    rectangle: null,
  }

  componentWillMount() {
    const itemsPerPage = 20;
    const pageNumber = 1;
    if (this.props.rectangle) {
      this.props.fetchEventsList(this.props.rectangle, itemsPerPage, pageNumber);
    }
  }

  componentWillReceiveProps(nextProps) {
    const itemsPerPage = 20;
    const pageNumber = 1;
    if ((nextProps.rectangle && !this.props.rectangle) ||
    (nextProps.rectangle.se.latitude !== this.props.rectangle.se.latitude)) {
      this.props.fetchEventsList(nextProps.rectangle, itemsPerPage, pageNumber);
    }
  }

  render() {
    const { events } = this.props;
    return (
      <List events={events} />
    );
  }
}

const mapStateToProps = (state) => ({
  events: selectors.getEventsList(state),
  rectangle: appSelectors.getViewport(state),
});

const mapDispatchToProps = {
  fetchEventsList: actions.fetchEventsList,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);
