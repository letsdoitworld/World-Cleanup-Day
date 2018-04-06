import axios from 'axios';

import { GOOGLE_GEOCODE_API_URL, API_KEY } from '../shared/constants';

const fetchAddress = async ({ latitude, longitude }) => {

  const { data } = await axios.get(
    `${GOOGLE_GEOCODE_API_URL}?key=${API_KEY}&latlng=${latitude},${longitude}`,
  );
  let completeAddress = '';
  let streetAddress = '';
  let locality = '';
  let country = '';
  let countryAlpha2Code = '';
  let streetNumber = '';
  let subLocality = '';

  if (data && data.results && data.results.length > 0) {
    completeAddress = data.results[0].formatted_address;
    data.results[0].address_components.forEach(({ types, long_name, short_name }) => {
      if (types.indexOf('route') !== -1) {
        streetAddress = long_name;
      } else if (types.indexOf('street_number') !== -1) {
        streetNumber = long_name;
      } else if (types.indexOf('locality') !== -1) {
        locality = long_name;
      } else if (types.indexOf('country') !== -1) {
        country = long_name;
        countryAlpha2Code = short_name;
      } else if (types.indexOf('sublocality') !== -1) {
        subLocality = long_name;
      }
      if (types.indexOf('street_address') !== -1 && !streetAddress) {
        streetAddress = long_name;
      }
    });
  }
  if (!streetAddress && subLocality && locality) {
    streetAddress = `${subLocality}, ${locality}`;
  }
  if (!streetAddress) {
    streetAddress = completeAddress;
  }
  return {
    completeAddress,
    streetAddress,
    locality,
    country,
    streetNumber,
    subLocality,
    countryAlpha2Code,
  };
};

export default {
  fetchAddress,
};

