import React, { Component } from 'react';

import { LocationService } from '../../services';
import {
  DEFAULT_ZOOM_LEVEL,
  ESTONIA_CENTER_COORDINATES,
  NO_PERMISSION_ZOOM_LEVEL,
} from '../../shared/constants';
import GoogleMap from './components/GoogleMap';
import { Loader } from '../../components/Spinner';
import { noop } from '../../shared/helpers';

class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapLocation: undefined,
      zoom: DEFAULT_ZOOM_LEVEL,
      mapLoaded: false,
    };
  }
  componentWillMount() {
    if (this.props.location) {
      this.setState({
        mapLocation: this.props.location,
        zoom: 16,
      });
      return;
    }
    LocationService.getLocation().then(
      location => this.setState({ mapLocation: location }),
      () =>
        this.setState({
          mapLocation: ESTONIA_CENTER_COORDINATES,
          zoom: NO_PERMISSION_ZOOM_LEVEL,
        }),
    );
  }

  handleMapLoad = map => {
    if (map) {
      this.map = map;
      this.setState({ mapLoaded: true });
    }
  };

  handleIdle = () => {
    if (this.state.mapLoaded && !this.mapSet) {
      this.props.setMapComponent(this.map);
      this.mapSet = true;
    }
  };

  render() {
    const {
      points,
      onPointClick,
      boundsChanged,
      onClick,
      center: propCenter,
      zoom: propZoom,
    } = this.props;
    const { mapLocation, zoom, mapLoaded } = this.state;

    const isMapReady = !!mapLocation;

    if (!isMapReady) {
      return <Loader />;
    }

    return (
      <GoogleMap
        onClick={onClick}
        containerElement={<div style={{ height: '100%' }} />}
        mapElement={<div style={{ height: '100%' }} />}
        points={points}
        onPointClick={onPointClick}
        location={mapLocation}
        zoom={propZoom || zoom}
        center={propCenter}
        setMapComponent={this.handleMapLoad}
        isIdle={this.handleIdle}
        onBoundsChanged={boundsChanged}
      />
    );
  }
}

MapView.defaultProps = {
  onClick: noop,
  setMapComponent: noop,
  boundsChanged: noop,
};

export default MapView;
