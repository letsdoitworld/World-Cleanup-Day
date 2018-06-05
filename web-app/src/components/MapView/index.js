import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { LocationService } from '../../services';
import {
  DEFAULT_ZOOM_LEVEL,
  ESTONIA_CENTER_COORDINATES,
  NO_PERMISSION_ZOOM_LEVEL,
} from '../../shared/constants';
import GoogleMapView from './components/GoogleMap';
import { Loader } from '../../components/Spinner';
import {
  actions as appActions,
} from '../../reducers/app';
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
      location => {
        this.props.setCurrentLocation(location);
        this.setState({ mapLocation: location, zoom: DEFAULT_ZOOM_LEVEL });
      },
      () => {
        this.props.setCurrentLocation(ESTONIA_CENTER_COORDINATES);
        this.setState({
          mapLocation: ESTONIA_CENTER_COORDINATES,
          zoom: NO_PERMISSION_ZOOM_LEVEL,
        });
      },
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
      cursor,
    } = this.props;
    const { mapLocation, zoom } = this.state;
    const isMapReady = !!mapLocation;
    if (!isMapReady) {
      return <Loader />;
    }

    return (
      <GoogleMapView
        cursor={cursor}
        onClick={onClick}
        containerElement={<div className="h-100" />}
        mapElement={<div className="h-100" />}
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

MapView.propTypes = {
  onClick: PropTypes.func,
  points: PropTypes.arrayOf(PropTypes.shape).isRequired,
  onPointClick: PropTypes.func,
  setCurrentLocation: PropTypes.func.isRequired,
  setMapComponent: PropTypes.func,
  boundsChanged: PropTypes.func,
  center: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  zoom: PropTypes.number,
  cursor: PropTypes.any,
  location: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
};

MapView.defaultProps = {
  onClick: noop,
  setMapComponent: noop,
  boundsChanged: noop,
  onPointClick: null,
  location: null,
  cursor: null,
  zoom: null,
  center: null,
};

const mapDispatchToProps = {
  setCurrentLocation: appActions.setCurrentLocation,
};

export default connect(undefined, mapDispatchToProps)(MapView);
