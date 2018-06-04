import React, {Component} from 'react';
import {MapView} from 'expo';
import PropTypes from 'prop-types';

import Marker from './Marker';
import styles from './styles';

class Map extends Component {
  displayMarkers = () => {
    const {markers = [], handleOnMarkerPress} = this.props;
    return markers.map((marker, key) => <Marker
      marker={marker}
      key={marker.id || key}
      onMarkerPress={handleOnMarkerPress}
    />);
  };

  displayCircle = () => {
    const {circleProps} = this.props;
    return circleProps
      ? <MapView.Circle
        center={circleProps.center}
        radius={circleProps.radius}
        strokeWidth={circleProps.borderWidth}
        strokeColor={circleProps.borderColor}
        fillColor={circleProps.fillColor}
      />
      : null;
  };
  onRegionChangeComplete = (region) => {
    const {onRegionChangeComplete} = this.props;
    let {longitudeDelta, longitude} = region;
    if (onRegionChangeComplete) {
      // on android, the longitude delta is sometimes negative ( which doesn't make any sense )
      // https://github.com/airbnb/react-native-maps/issues/1386
      if (longitudeDelta < 0) {
        longitudeDelta += 360;
      }
      // sometimes, on iOS, the longitude can be higher that 180
      // it has to be traslated to an equivalent negative lognitude
      // i.e. 220 degrees means -150 degrees
      if (longitude > 180) {
        longitude -= 360;
      }
      if (longitude < -180) {
        longitude += 360;
      }
      onRegionChangeComplete({
        ...region,
        longitude,
        longitudeDelta,
      });
    }
  };

  render() {
    return (
      <MapView
        rotateEnabled={false}
        {...this.props}
        ref={this.props.getRef}
        style={styles.container}
        onRegionChangeComplete={this.onRegionChangeComplete}
        provider="google"
      >
        {this.displayMarkers()}
        {this.displayCircle()}
      </MapView>
    );
  }
}

Map.propTypes = {
  // disabled becuase of too many warnings
  // TODO fix this
  // markers: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     latlng: PropTypes.shape(
  //       PropTypes.objectOf({
  //         latitude: PropTypes.number,
  //         longitude: PropTypes.number,
  //       }),
  //     ),
  //     title: PropTypes.string,
  //     description: PropTypes.string,
  //   }),
  // ),
  onRegionChangeComplete: PropTypes.func,
  initialRegion: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    latitudeDelta: PropTypes.number,
    longitudeDelta: PropTypes.number,
  }),
  onMarkerPress: PropTypes.func,
  circleProps: PropTypes.shape({
    radius: PropTypes.number.isRequired,
    borderColor: PropTypes.string.isRequired,
    fillColor: PropTypes.string.isRequired,
    center: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }).isRequired,
    borderWidth: PropTypes.number.isRequired,
  }),
  getRef: PropTypes.func,
};

export default Map;
