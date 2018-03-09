import React from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MapView from '../MapView';
import {
  selectors as trashpileSelectors,
  actions as trashpileActions,
} from '../../reducers/trashpile';
import {
  selectors as eventSelectors,
  actions as eventActions
} from '../../reducers/events'
import { getViewportPoints } from '../../shared/helpers';
import { GRID_HASH, DELTA_HASH, GRID_MIN_VALUE } from '../../shared/constants';

class MarkersMap extends React.Component {
  static defaultProps = {
    onMarkerClick: null,
  };
  static propTypes = {
    fetchAllTrashpoints: PropTypes.func.isRequired,
    onMarkerClick: PropTypes.func,
    markers: PropTypes.array.isRequired,
    gridValue: PropTypes.any.isRequired,
    fetchClusterTrashpoints: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      updateRegion: true,
    };
  }

  handleSetMapComponent = map => {
    this.map = map;
    if (map) {
      this.loadMarkers();
    }
  };
  handleBoundsChanged = () => {
    if (this.map) {
      this.loadMarkers();
    }
  };
  componentWillReceiveProps = nextProps => {
    if (
      this.props.focusedLocation !== nextProps.focusedLocation &&
      nextProps.focusedLocation
    ) {
      const { focusedLocation } = nextProps;
      if (this.map) {

        const { latitude, longitude } = focusedLocation;
        const bounds = {
          north: latitude - 0.0001,
          south: latitude + 0.0001,
          west: longitude - 0.0001,
          east: longitude + 0.0001,
        }
        this.map.fitBounds(bounds);
      }
    }
  };

  loadMarkers = () => {
    if (!this.state.updateRegion) {
      return this.setState({ updateRegion: true });
    }
    const mapElContainer = this.map.getDiv();
    const mapSize = {
      height: parseInt(getComputedStyle(mapElContainer).height),
      width: parseInt(getComputedStyle(mapElContainer).width)
    };
    const { nw, se } = getViewportPoints(this.map.getBounds());
    this.props.fetchAllEventMarkers();
    //this.props.fetchAllTrashpoints(nw, se, mapSize);
  };
  handleMarkerClick = marker => {
    if (!marker.isTrashpile) {
      return;
    }
    if (marker && !marker.count) {
      if (typeof this.props.onMarkerClick === 'function') {
        this.props.onMarkerClick(marker);
      }
    } else if (this.map && _.has(this.props, 'gridValue.gridValueToZoom')) {
      const diagonaleInMeters = GRID_HASH[this.props.gridValue.gridValueToZoom];
      const region = {
        ...DELTA_HASH[diagonaleInMeters],
        ...marker.position,
      };
      if (diagonaleInMeters !== GRID_MIN_VALUE) {
        const { lat, lng, latitudeDelta, longitudeDelta } = region;
        const bounds = {
          north: lat - latitudeDelta / 16,
          south: lat + latitudeDelta / 16,
          west: lng - longitudeDelta / 16,
          east: lng + longitudeDelta / 16,
        };

        this.map.fitBounds(bounds);
      } else {

        this.setState(
          {
            updateRegion: false,
          },
          () => {
            let cellSize = 0;
            const mapElContainer = this.map.getDiv();
            const mapSize = {
              height: parseInt(getComputedStyle(mapElContainer).height),
              width: parseInt(getComputedStyle(mapElContainer).width)
            };
            const { nw, se } = getViewportPoints(this.map.getBounds());
            if (se.longitude > nw.longitude) {
              cellSize = 38 * (se.longitude - nw.longitude) / mapSize.width;
            } else {
              cellSize = (180 - nw.longitude + se.longitude + 180) * 38 / mapSize.width;
            }
            this.props.fetchClusterTrashpoints({
              cellSize,
              coordinates: marker.coordinates,
              clusterId: marker.id,
            })
          },
        );
      }
    }
  };

  render() {
    const { markers, eventMarkers } = this.props;
    return (
      <MapView
        points={eventMarkers}
        setMapComponent={this.handleSetMapComponent}
        boundsChanged={this.handleBoundsChanged}
        onPointClick={this.handleMarkerClick}
      />
    );
  }
}
const mapState = state => ({
  markers: trashpileSelectors.getAllMarkers(state),
  eventMarkers: eventSelectors.getAllEventMarkers(state),
  gridValue: trashpileSelectors.getGridValue(state),
  focusedLocation: trashpileSelectors.getFocusedLocation(state),
});
const mapDispatch = {
  fetchAllTrashpoints: trashpileActions.fetchAllMarkers,
  fetchAllEventMarkers: eventActions.fetchAllEventMarkers,
  fetchClusterTrashpoints: trashpileActions.fetchClusterTrashpoints,
};
export default connect(mapState, mapDispatch)(MarkersMap);
