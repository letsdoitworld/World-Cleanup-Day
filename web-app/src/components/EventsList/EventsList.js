import { NavLink } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import EventListHeader from './EventListHeader';
import { EventDetails } from './EventDetails';
import { Event } from './Event';
import { noEventsCover } from '../common/Icons';
import './EventsList.css';

const EventsList = ({
  events,
  toggleEventWindow,
  eventId,
  eventDetails,
  history,
  isOpened,
  fetchEventDetails,
  fetchEventsList,
  showShareModal,
}) => {
  const { id } = eventDetails;
  return (
    <div className="EventsList-container">
      <EventListHeader
        onMinimizeClick={toggleEventWindow}
        onSearch={fetchEventsList}
        history={history}
        eventId={eventId}
      />
      <div className={classnames('EventsList-plot', { visible: isOpened })}>
        {
          id && eventId ?
            <EventDetails
              eventId={eventId}
              eventDetails={eventDetails}
              showShareModal={showShareModal}
            /> :
            (
              events.length ?
              events.map(ev => {
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
                <img src={noEventsCover} alt="no-events-cover" />
                <div className="no-events-text">
                  <p className="p1">Nothing to see here!</p>
                  <p className="p2">
                    Widen the search area or try another filter
                  </p>
                </div>
              </div>
            )
        }
      </div>
    </div>
  );
};

EventsList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape).isRequired,
  toggleEventWindow: PropTypes.func.isRequired,
  eventId: PropTypes.string,
  eventDetails: PropTypes.any,
  isOpened: PropTypes.bool.isRequired,
  fetchEventDetails: PropTypes.func.isRequired,
  fetchEventsList: PropTypes.func.isRequired,
  showShareModal: PropTypes.func.isRequired,
};

EventsList.defaultProps = {
  eventId: '',
  eventDetails: null,
};

export default EventsList;
