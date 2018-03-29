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
  selectors as appSelectors,
} from '../../reducers/app';

class EventsList extends Component {
  render() {
    const {
      events,
      toggleEventWindow,
      eventId,
      eventDetails,
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
            eventDetails.id && eventId ?
            <EventDetails eventId={eventId} eventDetails={eventDetails} /> :
            events.map((ev) => {
              return (
                <NavLink key={ev.id} to={`/event/${ev.id}`}>
                  <Event
                    onClick={fetchEventDetails}
                    eventId={ev.id}
                    avatar={ev.avatar}
                    title={ev.name}
                    author={ev.email}
                    date={ev.startTime}
                    location={ev.address}
                    maxNumberOfParticipants={ev.maxPeopleAmount || 20}
                    numberOfParticipants={ev.peopleAmount}
                  />
                </NavLink>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default EventsList;
