import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Map } from '../components/Map';
import { fetchMarkers as fetchMarkersAction } from '../reducers/map';
import { actions as trashpileActions } from '../reducers/trashpile';
import { DEFAULT_ZOOM } from '../shared/constants';

class Home extends Component {

  onPressMarker = index => {
    if (typeof index === 'number') {
      if (this.props.markers[index].isTrashPile) {
        this.props.resetTrashpileAddress();
        this.props.navigation.navigate('Details', {
          marker: this.props.markers[index],
        });
      }
    }
  };

  handleOnRegionChangeComplete = center => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = center;

    const northWest = {
      latitude: latitude + latitudeDelta / 2,
      longitude: longitude - longitudeDelta / 2,
    };
    const southEast = {
      latitude: latitude - latitudeDelta / 2,
      longitude: longitude + longitudeDelta / 2,
    };

    this.props.fetchMarkers(northWest, southEast);
  };

  render() {
    const { markers, initialRegion } = this.props;
    if (!initialRegion) {
      return null;
    }
    return (
      <View style={{ flex: 1 }}>
        <StatusBar translucent={false} barStyle="default" />
        <Map
          onRegionChangeComplete={this.handleOnRegionChangeComplete}
          markers={markers}
          initialRegion={initialRegion}
          onMarkerPress={this.onPressMarker}
        />
      </View>
    );
  }
}

const mapStateToProps = ({
  map: { markers },
  user: { location: { latitude, longitude } },
}) => {
  let initialRegion = null;
  let userMarker = null;
  if (latitude && longitude) {
    userMarker = {
      latlng: {
        latitude,
        longitude,
      },
      title: '',
      description: '',
      status: 'user',
      clusterCount: 0,
    };

    initialRegion = {
      latitude,
      longitude,
      latitudeDelta: DEFAULT_ZOOM,
      longitudeDelta: DEFAULT_ZOOM,
    };
  }

  const mapMarkers = [...markers];
  if (userMarker) {
    mapMarkers.push(userMarker);
  }

  return {
    markers: mapMarkers,
    initialRegion,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchMarkers(northWest, southEast) {
      dispatch(fetchMarkersAction(northWest, southEast));
    },
    resetTrashpileAddress: () =>
      dispatch(trashpileActions.resetTrashpileAddress),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
