import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  TrashpointIcons,
  LocationIcon24px,
} from '../../common/Icons';

export const TrashpointListItem = ({ data, eventId }) => (
  <NavLink to={`/event/${eventId}/trashpoints/${data.id}`}>
    <div className="EventDetails-TrashpointListItem">
      <img
        className="EventDetails-TrashpointListItem-status"
        src={TrashpointIcons[data.status]}
        alt="status"
      />
      <LocationIcon24px />
      <p className="EventDetails-TrashpointListItem-addr">
        {
          data.name.trim() ||
          `${data.location.latitude}, ${data.location.longitude}`
        }
      </p>
    </div>
  </NavLink>
);

TrashpointListItem.propTypes = {
  data: PropTypes.any.isRequired,
  eventId: PropTypes.string.isRequired,
};
