import React from 'react';
import { If, Else } from 'react-if';
import PropTypes from 'prop-types';
import { TrashpointListItem } from './TrashpointListItem';
import { EmptyEventsState } from '../EmptyState';

export const TrashpointList = ({ trashpoints, eventId }) => (
  <div className="EventDetails-TrashpointList">
    <If condition={!!trashpoints && !!trashpoints.length}>
      <div>
        {
          trashpoints && trashpoints.map(tp => {
            return (
              <TrashpointListItem key={tp.id} eventId={eventId} data={tp} />
            );
          })
        }
      </div>
      <Else>
        <EmptyEventsState />
      </Else>
    </If>
  </div>
);

TrashpointList.propTypes = {
  trashpoints: PropTypes.arrayOf(PropTypes.shape).isRequired,
  eventId: PropTypes.string.isRequired,
};
