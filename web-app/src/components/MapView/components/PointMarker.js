import React from 'react';
import { Marker } from 'react-google-maps';

export default props => {
  const { point, onPointClick } = props;

  return <Marker {...point} onClick={() => onPointClick(point)} />;
}
