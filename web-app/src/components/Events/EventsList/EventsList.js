import React from 'react';
import { NavLink } from 'react-router-dom';
import { If, Else } from 'react-if';
import PropTypes from 'prop-types';
import { Event } from '../Event';
import { EmptyEventsState } from '../EmptyState';

export const List = ({ events }) => (
  <div>
    <If condition={!!events.length}>
      <div>
        {
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
          },
          )
        }
      </div>
      <Else>
        <EmptyEventsState text={'Nothing to see here!'} subheadNeeded />
      </Else>
    </If>
  </div>
);

List.propTypes = {
  events: PropTypes.any,
};

List.defaultProps = {
  events: null,
};
