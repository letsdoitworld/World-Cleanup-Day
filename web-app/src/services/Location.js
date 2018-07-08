import axios from 'axios';

const GOOGLE_GEOCODE_API_URL = 'https://maps.google.com/maps/api/geocode/json';
const API_KEY = 'AIzaSyDPpazJRvOYVRE6JBjAW5fbpLq8TDkSS98';

export default {
  getLocation: () => {
    if (!window.navigator.geolocation) {
      throw new Error('Geolocation is not defined. Please use another browser');
    }
    const geolocation = window.navigator.geolocation;

    return new Promise((resolve, reject) => {
      geolocation.getCurrentPosition(position => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      }, reject);
    });
  },
  fetchAddress: async ({ latitude, longitude }) => {
    const { data } = await axios.get(
      `${GOOGLE_GEOCODE_API_URL}?key=${API_KEY}&latlng=${latitude},${longitude}&language=EN`,
    );
    let completeAddress = '';
    let streetAddress = '';
    let locality = '';
    let country = '';
    let streetNumber = '';
    let subLocality = '';

    if (data && data.results && data.results.length > 0) {
      completeAddress = data.results[0].formatted_address;
      data.results[0].address_components.forEach(({ types, long_name }) => {
        if (types.indexOf('route') !== -1) {
          streetAddress = long_name;
        } else if (types.indexOf('street_number') !== -1) {
          streetNumber = long_name;
        } else if (types.indexOf('locality') !== -1) {
          locality = long_name;
        } else if (types.indexOf('country') !== -1) {
          country = long_name;
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
    };
  },
};
