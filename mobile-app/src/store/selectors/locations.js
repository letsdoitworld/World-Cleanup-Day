import { createSelector } from 'reselect';

import find from 'lodash/find';

import { COUNTRY_LIST, DEFAULT_ZOOM } from '../../shared/constants';

const getState = state => state.toJS();

const locationsSelector = createSelector(getState, state => state.locations);

export const getCountryCode = createSelector(
  locationsSelector,
  locations => locations.userLocation && locations.userLocation.countryAlpha2Code,
);

export const getUserCountry = createSelector(
  getCountryCode,
  countryCode => find(COUNTRY_LIST, c => c.code === countryCode),
);

export const getCoordUser = createSelector(
  locationsSelector,
  locations =>
    locations.userLocation
    &&
      {
        latitude: locations.userLocation.latitude,
        longitude: locations.userLocation.longitude,
        latitudeDelta: DEFAULT_ZOOM,
        longitudeDelta: DEFAULT_ZOOM,
      },
);

