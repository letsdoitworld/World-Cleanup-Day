import React from 'react';

import './TeamsListItem.css';

const TeamsListItem = ({ team: { name, trashpoints, users} , fetchTeam}) => {
  return (
    <div className="TeamsListItem TeamListItem-100" onClick={fetchTeam}>
      <div className="TeamsListItem-name-container">
        {name}
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
