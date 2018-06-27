import React from 'react';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import 'moment/locale/uk';
import classnames from 'classnames';
import {
  LocationIcon24px,
  eventCover,
} from '../../../components/common/Icons';
import './Event.css';

export const Event = ({
  avatar,
  title,
  location,
  attendeesAmount,
  maxNumberOfAttendees,
  date,
}) => {
  const eventStatus = moment(date).isBefore(moment()) ?
  'Past' : 'Upcoming';
  moment.locale('uk');
  return (
    <div>
      <div className="Event-item">
        <div
          className="Event-avatar"
          style={{ backgroundImage: `url(${avatar || eventCover})` }}
        />
        <div className="Event-details">
          <div className="Event-details-part1">
            <p className="Event-title Event-info">{title}</p>
            <p className={
              classnames('Event-status', 'Event-info', eventStatus)}
            >
              {eventStatus}
            </p>
            <p className="Event-location Event-info">
              <LocationIcon24px />
              <span>{location}</span>
            </p>
          </div>
          <div className="Event-details-part2">
            <p className="Event-fill Event-info">
              {`${attendeesAmount}/${maxNumberOfAttendees}`}
            </p>
            <p className="Event-date Event-info">
              {moment(date).format('L')}
            </p>
          </div>
        </div>
      </div>
      <div className="Event-divider" />
    </div>
  );
};

Event.propTypes = {
  avatar: PropTypes.string,
  title: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  attendeesAmount: PropTypes.number.isRequired,
  maxNumberOfAttendees: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
};

Event.defaultProps = {
  avatar: '',
};
