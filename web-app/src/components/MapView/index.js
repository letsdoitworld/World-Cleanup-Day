import React, { Component } from 'react';

import { Location } from 'services';

import GoogleMap from './components/GoogleMap';

class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapLocation: undefined,
      zoom: 10
    };
  }
  componentWillMount() {
    Location.getLocation()
      .then(
        location => this.setState({ mapLocation: location }),
        () => this.setState({ mapLocation: { lat: 0, lng: 0 } }),
      );
  }
  render() {
    const { points, onPointClick } = this.props;
    const { mapLocation, zoom } = this.state;

    const isMapReady = !!mapLocation;

    if (!isMapReady) {
      return <div>Loading</div>;
    }

    return (
      <GoogleMap
        containerElement={<div style={{ height: '500px', width: '500px' }} />}
        mapElement={<div style={{ height: '500px', width: '500px' }} />}
        points={points}
        onPointClick={onPointClick}
        location={mapLocation}
        zoom={zoom}
      />
    );
  }
}
export default MapView;
