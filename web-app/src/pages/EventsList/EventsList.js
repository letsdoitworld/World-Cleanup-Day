import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import EventListHeader from './EventListHeader';
import { EventDetails } from './EventDetails';
import { Event } from './Event';
import './EventsList.css';
import { actions, selectors } from '../../reducers/events';
import {
  actions as appActions,
} from '../../reducers/app';

class EventsList extends Component {

  componentWillMount() {
    this.props.fetchAllEvents();
    this.props.setActiveTab('events');
  }

  render() {
    const {
      events,
      toggleEventWindow,
      eventId,
      history,
      isOpened,
      fetchEventDetails,
    } = this.props;

    return (
      <div className="EventsList-container">
        <EventListHeader
          onMinimizeClick={() => toggleEventWindow()}
          history={history}
          eventId={eventId}
        />
        <div className={`EventsList-plot ${isOpened ? 'visible' : ''}`}>
          {
            !eventId ?
            events.map((ev) => {
              return (
                <NavLink key={ev.datasetId} to={`/events/${ev.datasetId}`}>
                  <Event
                    onClick={fetchEventDetails}
                    eventId={ev.datasetId}
                    avatar={ev.avatar}
                    title={ev.title}
                    author={ev.coordinator_name}
                    date={ev.createDate}
                    location={ev.address}
                    numberOfParticipants={ev.number_of_participants}
                  />
                </NavLink>
              );
            }) :
            <EventDetails eventId={eventId} fetchEventDetails={fetchEventDetails} />
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  events: selectors.getEventsList(state),
  isOpened: selectors.getShowEventWindow(state),
});

const mapDispatchToProps = {
  toggleEventWindow: actions.toggleEventWindow,
  fetchAllEvents: actions.fetchAllEvents,
  fetchEventDetails: actions.fetchEventDetails,
  setActiveTab: appActions.setActiveTab,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);
