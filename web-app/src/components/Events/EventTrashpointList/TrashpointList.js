import React from 'react';
import { If, Else } from 'react-if';
import PropTypes from 'prop-types';
import { TrashpointListItem } from './TrashpointListItem';
import { EmptyEventsState } from '../EmptyState';
import { Loader } from '../../Spinner';

export const TrashpointList = ({ trashpoints, eventId, isLoading }) => (
  <div className="EventDetails-TrashpointList">
    <If condition={!isLoading}>
      <div>
        {
          trashpoints &&
          trashpoints.length ?
          trashpoints.map(tp => {
            return (
              <TrashpointListItem key={tp.id} eventId={eventId} data={tp} />
            );
          }) :
          <EmptyEventsState text="No trashpoints." />
        }
      </div>
      <Else>
        <Loader />
      </Else>
    </If>
  </div>
);

TrashpointList.propTypes = {
  trashpoints: PropTypes.arrayOf(PropTypes.shape).isRequired,
  eventId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
