import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  TrashpointIcons,
  LocationIcon24px,
} from '../../common/Icons'

export const TrashpointListItem = ({ data }) => (
  <NavLink to={`/trashpoints/${data.id}`}>
    <div className="EventDetails-TrashpointListItem">
      <img
        className="EventDetails-TrashpointListItem-status"
        src={TrashpointIcons[data.status]}
        alt="status"
      />
      <LocationIcon24px />
      <p>{ data.name }</p>
    </div>
  </NavLink>
);
