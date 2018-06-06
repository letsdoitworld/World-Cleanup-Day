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
    eventsMeta: PropTypes.shape({
      pageNumber: PropTypes.number,
      pageSize: PropTypes.number,
      total: PropTypes.number,
      totalPages: PropTypes.number,
    }).isRequired,
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
    const itemsPerPage = 50;
    const pageNumber = 1;
    if (this.props.rectangle) {
      this.props.fetchEventsList(this.props.rectangle, itemsPerPage, pageNumber);
    }
  }

  componentDidMount() {
    document.getElementsByClassName('EventsList-plot')[0].addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps(nextProps) {
    const { rectangle, fetchEventsList, eventsMeta } = this.props;
    const defaultPageSize = 50;
    const defaultPageNumber = 1;
    if ((nextProps.rectangle && !rectangle) ||
    (nextProps.rectangle.se.latitude !== rectangle.se.latitude)) {
      fetchEventsList(nextProps.rectangle, defaultPageSize, defaultPageNumber);
    }
    if (nextProps.eventsMeta.pageNumber !== eventsMeta.pageNumber && nextProps.eventsMeta.pageNumber === 1) {
      document.getElementsByClassName('EventsList-plot')[0].scrollTop = 0;
    }
  }

  handleScroll = () => {
    const { eventsMeta, rectangle, fetchEventsList } = this.props;
    const element = document.getElementsByClassName('EventsList-plot')[0];
    const scrolledPixels = element.scrollTop;
    const scrollAmount = element.scrollHeight;
    const elementHeight = element.offsetHeight;
    const ifScrolledToBottom = scrollAmount === scrolledPixels + elementHeight;
    /* condition - user scrolled to bottom of the list */
    if (ifScrolledToBottom && eventsMeta.pageNumber < eventsMeta.totalPages) {
      fetchEventsList(
        rectangle,
        eventsMeta.pageSize,
        eventsMeta.pageNumber + 1,
      );
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
  eventsMeta: selectors.getEventsListMeta(state),
  rectangle: appSelectors.getViewport(state),
});

const mapDispatchToProps = {
  fetchEventsList: actions.fetchEventsList,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);
