import React, { Component } from 'react';
import { MapView } from 'expo';
import PropTypes from 'prop-types';

import Marker from './Marker';
import styles from './styles';

class Map extends Component {
  triggerEvent = (eventFn, ...args) => {
    if (typeof eventFn === 'string') {
      console.log(eventFn, ...args);
    } else {
      eventFn(...args);
    }
  };

  onPress = event => {
    // this.triggerEvent('onPress', event);
  };

  handleOnMarkerPress = index => {
    this.props.onMarkerPress(index)
  };

  onRegionChange = event => {
    // console.log("onRegionChange", event);
  };

  handleRegionChangeComplete = event => {
    this.isZoomEvent(event)
      ? this.onZoomComplete(event)
      : this.onPanComplete(event);
    this.previousCenter = event;
  };

  onZoomComplete = event => {
    const { longitudeDelta, latitudeDelta, longitude, latitude } = event;
    const northWest = {
      latitude: event.latitude + event.latitudeDelta / 2,
      longitude: event.longitude - event.longitudeDelta / 2,
    },
      southEast = {
        latitude: event.latitude - event.latitudeDelta / 2,
        longitude: event.longitude + event.longitudeDelta / 2,
      };
    const zoomEvent = {
      northWest,
      southEast,
    };
    this.triggerEvent('onZoomComplete', zoomEvent);
  };

  onPanComplete = event => {
    this.triggerEvent('onPanComplete', event);
  };

  isZoomEvent(center) {
    const { longitudeDelta, latitudeDelta, longitude, latitude } = center;
    if (!this.previousCenter) {
      return false;
    }
    if (
      longitudeDelta !== this.previousCenter.longitudeDelta &&
      latitudeDelta !== this.previousCenter.latitudeDelta
    ) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <MapView
        ref={mapView => (this.mapView = mapView)}
        style={styles.container}
        onRegionChange={this.onRegionChange}
        provider="google"
        {...this.props}
      >
        {this.props.markers.map((marker, index) => {
          return (
            <Marker
              marker={marker}
              key={index}
              onMarkerPress={this.handleOnMarkerPress}
              index={index}
            />
          );
        })}
      </MapView>
    );
  }
}

Map.propTypes = {
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      latlng: PropTypes.shape(
        PropTypes.objectOf({
          latitude: PropTypes.number,
          longitude: PropTypes.number,
        }),
      ),
      title: PropTypes.string,
      description: PropTypes.string,
    }),
  ),
  onRegionChangeComplete: PropTypes.func.isRequired,
  initialRegion: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    latitudeDelta: PropTypes.number,
    longitudeDelta: PropTypes.number,
  }),
  onMarkerPress: PropTypes.func,
};

export default Map;
