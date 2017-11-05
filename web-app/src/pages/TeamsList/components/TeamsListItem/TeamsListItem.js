import React from 'react';

import './TeamsListItem.css';

const TeamsListItem = ({ team: { name, trashpoints } }) => {
  return (
    <div className="TeamsListItem">
      <div className="TeamsListItem-name-container">
        {name}
      </div>
      <div className="TeamsListItem-trashpoint-container">
        {trashpoints}
      </div>
    </div>
  );
};
export default TeamsListItem;
