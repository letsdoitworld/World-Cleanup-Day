import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import classnames from 'classnames';
import EventListHeader from './EventListHeader';
import { EventDetails } from './EventDetails';
import { Event } from './Event';
import { noEventsCover } from '../common/Icons';
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
      fetchEventsList,
    } = this.props;

    return (
      <div className="EventsList-container">
        <EventListHeader
          onMinimizeClick={() => toggleEventWindow()}
          onSearch={fetchEventsList}
          history={history}
          eventId={eventId}
        />
        <div className={classnames('EventsList-plot', { 'visible': isOpened }) }>
          {
            eventDetails.id && eventId ?
            <EventDetails eventId={eventId} eventDetails={eventDetails} /> :
            events.length ?
            events.map((ev) => {
              return (
                <NavLink key={ev.id} to={`/event/${ev.id}`}>
                  <Event
                    eventId={ev.id}
                    avatar={ev.photos[0]}
                    title={ev.name}
                    author={ev.createdByName}
                    date={ev.startTime}
                    location={ev.address}
                    maxNumberOfParticipants={ev.maxPeopleAmount || 20}
                    numberOfParticipants={ev.peopleAmount}
                  />
                </NavLink>
              );
            }) :
            <div className="no-events-holder">
              <img src={noEventsCover} />
              <div className="no-events-text">
                <p className="p1">Nothing to see here!</p>
                <p className="p2">Widen the search area or try another filter</p>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default EventsList;
