import React from 'react';
import { noUsersCover } from '../common/Icons';

export const EmptyUsersState = () => (
  <div className="no-users-holder">
    <img src={noUsersCover} alt="no-users-cover" />
    <div className="no-users-text">
      <p className="p1">
        Nothing to see here!
      </p>
      <p className="p2">
        Try another country
      </p>
    </div>
  </div>
);
