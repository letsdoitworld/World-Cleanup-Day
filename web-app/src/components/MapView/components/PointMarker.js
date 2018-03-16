import React from 'react';
import { Marker } from 'react-google-maps';
import { connect } from 'react-redux';

import cleanedIcon from '../../../assets/pointer_cleaned.png';
import outdatedIcon from '../../../assets/pointer_outdated.png';
import regularIcon from '../../../assets/pointer_regular.png';
import threatIcon from '../../../assets/pointer_threat.png';
import userIcon from '../../../assets/location_pointer.png';
import changeLocationIcon from '../../../assets/change_location_pin.png';
import { locationPinInactive, locationPinActive } from '../../common/Icons';
import {
  selectors as eventSelectors,
} from '../../../reducers/events';

const MARKER_STATUS_IMAGES = {
  cleaned: cleanedIcon,
  outdated: outdatedIcon,
  regular: regularIcon,
  threat: threatIcon,
  user: userIcon,
  changeLocation: changeLocationIcon,
};

const PointMarker = props => {
  const { point, onPointClick, currentEventMarkerID } = props;
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
          fontSize: '16px',
        }}
        icon={{
          url: locationPinInactive,
          labelOrigin: {
            x: 20,
            y: 15,
          },
        }}
      />
    );
  }

  return (
    <Marker
      {...point}
      icon={{ url: currentEventMarkerID === point.id ? locationPinActive : locationPinInactive }}
      onClick={() => onPointClick(point)}
    />
  );
};

const mapStateToProps = state => ({
  currentEventMarkerID: eventSelectors.getCurrentMarkerID(state),
});

export default connect(mapStateToProps)(PointMarker);
