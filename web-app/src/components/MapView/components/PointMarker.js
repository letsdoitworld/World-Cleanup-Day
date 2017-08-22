import React from 'react';
import { Marker } from 'react-google-maps';

import cleanedIcon from '../../../assets/pointer_cleaned.png';
import outdatedIcon from '../../../assets/pointer_outdated.png';
import regularIcon from '../../../assets/pointer_regular.png';
import threatIcon from '../../../assets/pointer_threat.png';
import userIcon from '../../../assets/location_pointer.png';
import changeLocationIcon from '../../../assets/change_location_pin.png';

const MARKER_STATUS_IMAGES = {
  cleaned: cleanedIcon,
  outdated: outdatedIcon,
  regular: regularIcon,
  threat: threatIcon,
  user: userIcon,
  changeLocation: changeLocationIcon,
};

export default props => {
  const { point, onPointClick } = props;

  const isCluster = point.isTrashpile && point.count > 0;

  if (isCluster) {
    return (
      <Marker
        {...point}
        onClick={() => onPointClick(point)}
        label={{
          text: String(point.count),
          color: 'black',
          fontWeight: 'bold',
          fontSize: '16px',
        }}
        icon={{
          url: MARKER_STATUS_IMAGES[point.status],
          labelOrigin: {
            x: 32,
            y: 5,
          },
        }}
      />
    );
  }

  return (
    <Marker
      {...point}
      icon={{ url: MARKER_STATUS_IMAGES[point.status] }}
      onClick={() => onPointClick(point)}
    />
  );
};
