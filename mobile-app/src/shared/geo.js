import {IGPSCoordinates} from "NativeModules";

const API_KEY = 'AIzaSyDlJyYfCW6sP165uqxjHWB2OTAtH2NBAi4';

export async function geocodeCoordinates(coordinates) {
    try {
        const requestUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&key=${API_KEY}&result_type=locality|postal_code`;
        const response = await fetch(requestUrl);
        const data = await response.json();
        const location = data.results[0];
        return {
            id: location.place_id,
            mainText: location.formatted_address,
            secondaryText: ''
        };
    } catch (e) {
        return {
            mainText: `${coordinates.latitude.toFixed(3)}° N, ${coordinates.longitude.toFixed(3)}° E`
        }
    }
}

export async function getCurrentPosition(options) {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}