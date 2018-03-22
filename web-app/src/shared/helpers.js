import { GRID_VALUES, GRID_HASH } from './constants';
export const noop = () => {};

export const getViewportPoints = bounds => {
  const { b, f } = bounds;
  const nw = { longitude: b.b, latitude: f.b };
  const se = { longitude: b.f, latitude: f.f };
  return { nw, se };
};

export const debounce = (func, wait, immediate) => {
  let timeout;
  return function () {
    let context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export const getDistanceBetweenPointsInMeters = (lat1, lon1, lat2, lon2) => {
  const p = 0.017453292519943295; // Math.PI / 180
  const c = Math.cos;
  const a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;

  return 12742 * Math.asin(Math.sqrt(a)) * 1000; // 2 * R; R = 6371 km
};

export const getGridValue = diagonaleInMeters => {
  // console.log(diagonaleInMeters);
  const length = GRID_VALUES.length;
  const lastIndex = length - 1;

  if (diagonaleInMeters >= GRID_VALUES[lastIndex]) {
    return {
      gridValue: GRID_HASH[GRID_VALUES[lastIndex]],
      gridValueToZoom: GRID_HASH[GRID_VALUES[lastIndex - 1]],
    };
  }

  for (let i = 0; i < length; i++) {
    if (diagonaleInMeters <= GRID_VALUES[i]) {
      let previousIndex = i - 1;
      if (previousIndex < 0) {
        previousIndex = i;
      }
      return {
        gridValue: GRID_HASH[GRID_VALUES[i]],
        gridValueToZoom: GRID_HASH[GRID_VALUES[previousIndex]],
        maxZoomedIn: previousIndex === i,
      };
    }
  }
};

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

export const toRadians = no => no * Math.PI / 180;

export const toDegrees = no => no * 180 / Math.PI;

export const destinationPoint = (fromPoint,
  distance,
  bearing,
  radius = 6371e3,) => {
  const δ = distance / radius; // angular distance in radians
  const θ = toRadians(bearing);

  const φ1 = toRadians(fromPoint.latitude);
  const λ1 = toRadians(fromPoint.longitude);

  const sinOmega1 = Math.sin(φ1),
    cosOmega1 = Math.cos(φ1);
  const sineTeta = Math.sin(δ),
    cosTeta = Math.cos(δ);
  const sinTeta1 = Math.sin(θ),
    cosTeta1 = Math.cos(θ);

  const sinOmega2 = sinOmega1 * cosTeta + cosOmega1 * sineTeta * cosTeta1;
  const φ2 = Math.asin(sinOmega2);
  const y = sinTeta1 * sineTeta * cosOmega1;
  const x = cosTeta - sinOmega1 * sinOmega2;
  const λ2 = λ1 + Math.atan2(y, x);

  return {
    lat: toDegrees(φ2),
    lng: (toDegrees(λ2) + 540) % 360 - 180,
  };
};

export const guid = () =>
  `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;

const atob = input => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  const str = input.replace(/=+$/, '');
  let output = '';

  for (
    let bc = 0, bs = 0, buffer, i = 0;
    (buffer = str.charAt(i++));
    ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
      ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
      : 0
  ) {
    buffer = chars.indexOf(buffer);
  }

  return output;
};

export const convertToByteArray = input => {
  const binary_string = atob(input);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
};

export const getCountryFromStr = (str) => {
  if (str === undefined) {
    return '';
  }

  const texts = str.split('.');
  if (texts.length > 1) {
    return texts[0];
  }

  return str;
};
