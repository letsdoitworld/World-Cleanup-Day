/* eslint-disable no-undef */
import { NativeModules, Platform } from 'react-native';
import { DEFAULT_ZOOM } from '../shared/constants';

const RNCurrentLocation = NativeModules.RNCurrentLocation;

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

export async function getCurrentPositionAndroid() {
  try {
    if (Platform.OS === 'android') {
      return await RNCurrentLocation.getCurrentLocation();
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentPositionIos(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000,
      ...options,
    });
  });
}

export async function getCurrentPosition() {
  // TODO Rewrite me!! It's difficult
  let location;
  if (Platform.OS === 'android') {
    const androidLocation = await getCurrentPositionAndroid();
    if (!androidLocation) {
      throw new Error('Cannot ge location');
    }
    location = {
      ...androidLocation,
      latitudeDelta: DEFAULT_ZOOM,
      longitudeDelta: DEFAULT_ZOOM,
    };
    return location;
  }
  const { coords: { latitude, longitude } } = await getCurrentPositionIos();
  if (!latitude) {
    throw new Error('Cannot ge location');
  }
  location = {
    latitude,
    longitude,
    latitudeDelta: DEFAULT_ZOOM,
    longitudeDelta: DEFAULT_ZOOM,
  };
  return location;
}

export function getDistance(startPoint, endPoint) {
  const radlat1 = Math.PI * startPoint.latitude / 180;
  const radlat2 = Math.PI * endPoint.latitude / 180;
  const theta = startPoint.longitude - endPoint.longitude;
  const radtheta = Math.PI * theta / 180;
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) *
    Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  dist *= 1.609344;
  return dist * 1000;
}
