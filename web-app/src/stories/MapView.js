// @flow
import React from 'react';
import { action } from '@storybook/addon-actions';

import { MapView } from 'components';

const points = [
  {
    id: 1,
    position: { lat: 45, lng: 24 },
  },
];

const onPointClick = action('Point clicked');
export default () => {
  return (
    <MapView
      points={points}
      onPointClick={onPointClick}
      containerElement={
        <div style={{ height: '400px', width: '400px' }} />
      }
      mapElement={
        <div style={{ height: '400px', width: '400px' }} />
      }
    />
  );
};
