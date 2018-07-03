import React from 'react';
import { noTeamsCover } from '../../components/common/Icons';

export const EmptyTeamsState = () => (
  <div className="no-teams-holder">
    <img src={noTeamsCover} alt="no-teams-cover" />
    <div className="no-teams-text">
      <p className="p1">
        Your search was so unique.
      </p>
      <p className="p2">
        Try another team.
      </p>
    </div>
  </div>
);
