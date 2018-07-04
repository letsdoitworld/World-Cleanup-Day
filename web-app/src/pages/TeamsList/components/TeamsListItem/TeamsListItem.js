import React from 'react';
import PropTypes from 'prop-types';
import './TeamsListItem.css';

const TeamsListItem = ({
  team: { name, trashpoints, users, image },
  fetchTeam,
}) => {
  return (
    <div className="TeamsListItem TeamListItem-100" onClick={fetchTeam}>
      <div
        className="TeamsListItem-avatar"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="TeamsListItem-name-container">
        <span className="TeamsListItem-name">{name}</span>
      </div>
      <div className="TeamsListItem-users-container">
        {users}
      </div>
      <div className="TeamsListItem-trashpoint-container">
        {trashpoints}
      </div>
    </div>
  );
};
export default TeamsListItem;
