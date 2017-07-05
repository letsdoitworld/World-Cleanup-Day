// @flow

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
};
