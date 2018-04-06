import React from 'react';
import { withGoogleMap, GoogleMap } from 'react-google-maps';
import PointMarker from './PointMarker';
import { googleMapURL, DEFAULT_ZOOM_LEVEL } from '../../../shared/constants';
import { noop } from '../../../shared/helpers';

export default withGoogleMap(props => {
  const {
    zoom = DEFAULT_ZOOM_LEVEL,
    location,
    points = [],
    onPointClick = noop,
    setMapComponent = noop,
    isIdle = noop,
    onBoundsChanged = noop,
    onClick = noop,
    cursor,
  } = props;

  const mapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    scaleControl: true,
    minZoom: 3,
  };
  if (cursor) {
    mapOptions.draggableCursor = cursor;
  }

  return (
    <GoogleMap
      onClick={onClick}
      defaultZoom={zoom}
      defaultCenter={location}
      googleMapURL={googleMapURL}
      ref={setMapComponent}
      options={mapOptions}
      onIdle={isIdle}
      onDragEnd={onBoundsChanged}
      onZoomChanged={onBoundsChanged}
    >
      {points.map(point => (
        <PointMarker
          key={point.id}
          point={point}
          onPointClick={onPointClick}
        />
      ))}
    </GoogleMap>
  );
});
