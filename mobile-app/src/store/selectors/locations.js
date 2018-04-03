import { createSelector } from 'reselect';

import find from 'lodash/find';

import { DEFAULT_ZOOM, COUNTRY_LIST } from '../../shared/constants';

const getState = state => state.toJS();

const locationsSelector = createSelector(getState, state => state.locations);

const getCountryCode = createSelector(
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
        latitude: locations.userLocation.lat,
        longitude: locations.userLocation.long,
        latitudeDelta: 100,
        longitudeDelta: 100,
      },
);

