import React from 'react';
import { TrashpointListItem } from './TrashpointListItem';

export const TrashpointList = ({ trashpoints }) => (
  <div className="EventDetails-TrashpointList">
    {
      trashpoints.map(tp => {
        return (
          <TrashpointListItem key={tp.name} data={tp} />
        );
      })
    }
  </div>
);
