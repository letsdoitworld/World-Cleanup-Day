import { createSelector } from 'reselect';

import find from 'lodash/find';

import { COUNTRY_LIST } from '../../shared/constants';

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

