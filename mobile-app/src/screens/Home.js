import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { Map } from '../components/Map';
import { withNavigationHelpers } from '../services/Navigation';
import {
  operations as trashpileOperations,
  selectors as trashpileSelectors,
} from '../reducers/trashpile';
import { selectors as locationSelectors } from '../reducers/location';
import { selectors as appSelectors } from '../reducers/app';
import { SCREENS } from '../shared/constants';
import { DELTA_HASH, GRID_HASH, MIN_ZOOM } from '../shared/constants';
import _ from 'lodash';

class Home extends Component {
  state = {
    updateRegion: true,
  };

  shouldComponentUpdate(nextProps) {
    const locationChanged = this.props.userLocation !== nextProps.userLocation;
    return (
      nextProps.activeScreen === SCREENS.HOME ||
      nextProps.activeScreen === SCREENS.PUBLIC_HOME ||
      locationChanged
    );
  }

  onPressMarker = event => {
    const marker = this.props.markers.find(
      marker => marker.id === event.nativeEvent.id,
    );

    if (!marker || !marker.isTrashpile) {
      return;
    }

    if (marker && !marker.count) {
      this.props.navigation.navigate('Details', {
        markerId: event.nativeEvent.id,
        latlng: marker.latlng,
      });
    } else {
      if (this.map && _.has(this.props, 'delta.latitudeDelta')) {
        if (this.props.delta.latitudeDelta === MIN_ZOOM) {
          return this.setState({
            updateRegion: false
          }, () => {
            this.props.fetchClusterTrashpoints(
              this.props.delta.cellSize,
              marker.coordinates,
              marker.id
            );
          });
        }
        const region = {
          ...this.props.delta,
          ...marker.latlng,
        };
        this.map.animateToRegion(region, 100);
      }
    }
  };

  getMapObject = map => (this.map = map);

  handleOnRegionChangeComplete = center => {
    if (!this.state.updateRegion) {
      return this.setState({ updateRegion: true });
    }
    const adjustLongitude = n => {
      if (n < -180) {
        return 360 + n;
      }
      if (n > 180) {
        return n - 360;
      }
      return n;
    };
    const adjustLatitude = n => {
      const signMultiplier = n > 0 ? 1 : -1;
      if (Math.abs(n) > 90) {
        return signMultiplier * 89.999;
      }

      return n;
    };

    const { latitude, longitude, latitudeDelta, longitudeDelta } = center;
    const northWest = {
      latitude: adjustLatitude(latitude + latitudeDelta / 2),
      longitude: adjustLongitude(longitude - longitudeDelta / 2),
    };
    const southEast = {
      latitude: adjustLatitude(latitude - latitudeDelta / 2),
      longitude: adjustLongitude(longitude + longitudeDelta / 2),
    };

    this.props.fetchAllMarkers(northWest, southEast, {
      latitudeDelta,
      longitudeDelta,
    });
  };

  render() {
    const { markers, initialRegion } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <StatusBar translucent={false} barStyle="default" />
        <Map
          onRegionChangeComplete={this.handleOnRegionChangeComplete}
          markers={markers}
          initialRegion={initialRegion}
          handleOnMarkerPress={this.onPressMarker}
          getRef={this.getMapObject}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const mapMarkers = trashpileSelectors.markersSelector(state);
  const userMarker = locationSelectors.userMarkerSelector(state);
  const locationActive = locationSelectors.hasLocationActive(state);

  const markers = locationActive ? [...mapMarkers, userMarker] : mapMarkers;
  return {
    markers,
    initialRegion: locationSelectors.initialRegionSelector(state),
    activeScreen: appSelectors.getActiveScreen(state),
    userLocation: locationSelectors.userLocationSelector(state),
    delta: trashpileSelectors.getLastDeltaValue(state),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAllMarkers(northWestViewPort, southEastViewPort, delta) {
      dispatch(
        trashpileOperations.fetchAllMarkers(
          northWestViewPort,
          southEastViewPort,
          delta,
        ),
      );
    },
    fetchClusterTrashpoints(cellSize, coordinates, clusterId) {
      dispatch(
        trashpileOperations.fetchClusterTrashpoints({
          cellSize,
          coordinates,
          clusterId,
        }),
      );
    },
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withNavigationHelpers(),
)(Home);
