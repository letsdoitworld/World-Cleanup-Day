import React from 'react';
import { noEventsCover } from '../common/Icons';

export const EmptyEventsState = () => (
  <div className="no-events-holder">
    <img src={noEventsCover} alt="no-events-cover" />
    <div className="no-events-text">
      <p className="p1">Nothing to see here!</p>
      <p className="p2">
        Widen the search area or try another filter
      </p>
    </div>
  </div>
);
