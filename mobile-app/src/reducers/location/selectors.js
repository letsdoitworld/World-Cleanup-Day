import { createSelector } from 'reselect';

import {
  DEFAULT_ZOOM,
  MARKER_STATUSES,
  NO_LOCATION_ZOOM,
} from '../../shared/constants';

const stateSelector = state => state.location;
const userLocationSelector = createSelector(
  stateSelector,
  state => state.userLocation,
);
const initialRegionSelector = createSelector(
  stateSelector,
  ({ userLocation, locationRead }) => {
    const { latitude, longitude } = userLocation;
    const zoom = locationRead ? DEFAULT_ZOOM : NO_LOCATION_ZOOM;
    return {
      latitude,
      longitude,
      latitudeDelta: zoom,
      longitudeDelta: zoom,
    };
  },
);
const wasUserLocationSet = createSelector(
  stateSelector,
  state => state.locationRead,
);
const userMarkerSelector = createSelector(
  userLocationSelector,
  ({ latitude, longitude }) => ({
    latlng: {
      latitude,
      longitude,
    },
    status: MARKER_STATUSES.USER,
    id: '19241923#$%',
  }),
);
const hasLocationActive = createSelector(
  stateSelector,
  state => !!state.locationActive,
);
const hasLocationPermission = createSelector(
  stateSelector,
  state => !!state.locationPermissionGranted,
);
const shouldShowModal = createSelector(stateSelector, state => state.showModal);

export default {
  userLocationSelector,
  initialRegionSelector,
  userMarkerSelector,
  hasLocationActive,
  hasLocationPermission,
  wasUserLocationSet,
  shouldShowModal,
};
