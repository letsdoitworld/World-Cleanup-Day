import React from 'react';
import { NavLink } from 'react-router-dom';
import { If, Else } from 'react-if';
import PropTypes from 'prop-types';
import { Event } from '../Event';
import { EmptyEventsState } from '../EmptyState';
import { Loader } from '../../Spinner';

export const List = ({ events, isLoading }) => (
  <div>
    <If condition={!isLoading}>
      <div>
        {
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
                  attendeesAmount={ev.attendeesAmount}
                  maxNumberOfAttendees={ev.maxPeopleAmount}
                />
              </NavLink>
            );
          },
          ) :
          <EmptyEventsState text={'Nothing to see here!'} subheadNeeded />
        }
      </div>
      <Else>
        <Loader />
      </Else>
    </If>
  </div>
);

List.propTypes = {
  events: PropTypes.any,
  isLoading: PropTypes.bool.isRequired,
};

List.defaultProps = {
  events: null,
};
