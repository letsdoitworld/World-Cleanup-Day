import React from 'react';
import { withGoogleMap, GoogleMap } from 'react-google-maps';
import PointMarker from './PointMarker';


export default withGoogleMap(props => {
  const { zoom, location, points, onPointClick } = props;

  return (
    <GoogleMap
      defaultZoom={zoom}
      defaultCenter={location}
    >
      {points.map(
        point =>
          (
            <PointMarker
              key={point.id}
              point={point}
              onPointClick={onPointClick}
            />
          ),
      )}
    </GoogleMap>
  );
});
