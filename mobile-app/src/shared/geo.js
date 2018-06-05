/* eslint-disable no-undef */


const API_KEY = 'AIzaSyDlJyYfCW6sP165uqxjHWB2OTAtH2NBAi4';

export async function geocodeCoordinates(coordinates) {
  try {
    const requestUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=
    ${coordinates.latitude},${coordinates.longitude}&key=${API_KEY}`;
    const response = await fetch(requestUrl);
    const data = await response.json();
    const location = data.results[0];
    const components = location.address_components;

    let city = '';
    let street = '';
    let building = '';

    components.forEach((component) => {
      if (component.types.includes('street_number')) {
        building = component.short_name;
      }

      if (component.types.includes('route')) {
        street = component.short_name;
      }

      if (component.types.includes('locality')) {
        city = component.short_name;
      }
    });
    let formattedAddress = '';
    if (city !== '') {
      formattedAddress += city;
    }
    if (street !== '') {
      formattedAddress += `, ${street}`;
    }
    if (building !== '') {
      formattedAddress += `, ${building}`;
    }

    return {
      id: location.place_id,
      mainText: formattedAddress,
      secondaryText: '',
    };
  } catch (e) {
    return {
      mainText: `${coordinates.latitude.toFixed(3)}° N, 
      ${coordinates.longitude.toFixed(3)}° E`,
    };
  }
}

export async function getCurrentPosition(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}
