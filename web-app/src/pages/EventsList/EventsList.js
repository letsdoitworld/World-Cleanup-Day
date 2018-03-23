import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import classnames from 'classnames';
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
    this.props.fetchAllEvents({
      latitude: 44.988046,
      longitude: 44.878046,
    },
      5,
    );
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
      <div className={classnames('EventsList-plot', { 'visible': isOpened }) }>
          {
            !eventId ?
            events.map((ev) => {
              return (
                <NavLink key={ev.id} to={`/events/${ev.id}`}>
                  <Event
                    onClick={fetchEventDetails}
                    eventId={ev.id}
                    avatar={ev.avatar}
                    title={ev.name}
                    author={ev.email}
                    date={ev.startTime}
                    location={ev.address}
                    numberOfParticipants={ev.maxPeopleAmount || 20}
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
