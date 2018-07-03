import React from 'react';
import { If, Else } from 'react-if';
import PropTypes from 'prop-types';
import { TrashpointListItem } from './TrashpointListItem';
import { EmptyEventsState } from '../EmptyState';
import { Loader } from '../../Spinner';

export const TrashpointList = ({
  trashpoints,
  targetId,
  targetSection,
  isLoading,
}) => (
  <div className="EventDetails-TrashpointList">
    <If condition={!isLoading}>
      <div>
        {
          trashpoints &&
          trashpoints.length ?
          trashpoints.map(tp => {
            return (
              <TrashpointListItem
                key={tp.id}
                targetId={targetId}
                targetSection={targetSection}
                data={tp}
              />
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
  trashpoints: PropTypes.arrayOf(PropTypes.shape),
  targetId: PropTypes.string.isRequired,
  targetSection: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

TrashpointList.defaultProps = {
  trashpoints: [],
};
