import React from 'react';
import { NavLink } from 'react-router-dom';
import { If, Else } from 'react-if';
import PropTypes from 'prop-types';
import { Event } from '../Event';
import { noEventsCover } from '../../common/Icons';

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
        <div className="no-events-holder">
          <img src={noEventsCover} alt="no-events-cover" />
          <div className="no-events-text">
            <p className="p1">Nothing to see here!</p>
            <p className="p2">
              Widen the search area or try another filter
            </p>
          </div>
        </div>
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
