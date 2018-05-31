import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { actions, selectors } from '../../reducers/events';
import { List } from '../../components/Events/EventsList';

class EventsList extends Component {

  static propTypes = {
    fetchEventsList: PropTypes.func.isRequired,
    events: PropTypes.any.isRequired,
  };

  componentWillMount() {
    const itemsPerPage = 50;
    const pageNumber = 1;
    this.props.fetchEventsList(itemsPerPage, pageNumber);
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
});

const mapDispatchToProps = {
  fetchEventsList: actions.fetchEventsList,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);
