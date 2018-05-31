import React from 'react';
import { If, Else } from 'react-if';
import { TrashpointListItem } from './TrashpointListItem';

export const TrashpointList = ({ trashpoints }) => (
  <div className="EventDetails-TrashpointList">
    <If condition={!!trashpoints.length}>
      <div>
        {
          trashpoints.map(tp => {
            return (
              <TrashpointListItem key={tp.name} data={tp} />
            );
          })
        }
      </div>
      <Else>
        <div>Loading</div>
      </Else>
    </If>
  </div>
);
