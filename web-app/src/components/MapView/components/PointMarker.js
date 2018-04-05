import React from 'react';
import { Marker } from 'react-google-maps';
import { connect } from 'react-redux';
import { selectors as appSelectors } from '../../../reducers/app';

import userIcon from '../../../assets/location_pointer.png';
import changeLocationIcon from '../../../assets/change_location_pin.png';
import {
  TrashpointPins,
  locationPinInactive,
  locationPinActive,
  clusterIcon,
} from '../../common/Icons';
import {
  selectors as trashpileSelectors,
} from '../../../reducers/trashpile';
import {
  selectors as eventSelectors,
} from '../../../reducers/events';

const TRASHPOINT_INACTIVE_MARKER_STATUS_IMAGES = {
  cleaned: TrashpointPins.inactiveCleanedTp,
  outdated: TrashpointPins.inactiveInRegularTp,
  regular: TrashpointPins.inactiveRegularTp,
  threat: TrashpointPins.inactiveToxicTp,
  user: userIcon,
  changeLocation: changeLocationIcon,
};

const TRASHPOINT_ACTIVE_MARKER_STATUS_IMAGES = {
  cleaned: TrashpointPins.activeCleanedTp,
  outdated: TrashpointPins.activeInRegularTp,
  regular: TrashpointPins.activeRegularTp,
  threat: TrashpointPins.activeToxicTp,
  user: userIcon,
  changeLocation: changeLocationIcon,
};

const PointMarker = props => {
  const {
    point,
    onPointClick,
    currentEventMarkerID,
    currentTrashpointMarkerID,
    currentActiveTab,
  } = props;
  const isCluster = point.isTrashpile && point.count > 0;
  if (isCluster) {
    return (
      <Marker
        {...point}
        onClick={() => onPointClick(point)}
        label={{
          text: String(point.count),
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '14px',
        }}
        icon={{
          url: clusterIcon,
          labelOrigin: {
            x: 14,
            y: 15,
          },
        }}
      />
    );
  }
  if (!isCluster) {
    const eventMarker =
      (<Marker
        {...point}
        icon={{
          url: currentEventMarkerID === point.id ?
          locationPinActive :
          locationPinInactive,
        }}
        onClick={() => onPointClick(point)}
      />);

    const trashpointMarker =
      (<Marker
        {...point}
        icon={{
          url: currentTrashpointMarkerID === point.id ?
          TRASHPOINT_ACTIVE_MARKER_STATUS_IMAGES[point.status] :
          TRASHPOINT_INACTIVE_MARKER_STATUS_IMAGES[point.status],
        }}
        onClick={() => onPointClick(point)}
      />);

    switch (currentActiveTab) {
      case ('events'):
        return eventMarker;
      case ('trashpoints'):
        return trashpointMarker;
      default:
        return eventMarker;
    }
  }
};

const mapStateToProps = state => ({
  currentTrashpointMarkerID: trashpileSelectors.getCurrentMarkerID(state),
  currentEventMarkerID: eventSelectors.getCurrentMarkerID(state),
  currentActiveTab: appSelectors.getCurrentActiveTab(state),
});

export default connect(mapStateToProps)(PointMarker);

/*
*/
