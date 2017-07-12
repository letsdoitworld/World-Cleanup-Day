import { SCREEN_WIDTH, SCREEN_HEIGHT, PLATFORM_NAME } from './constants';

const DESIGNS_HEIGHT = 568;
const DESIGNS_WIDTH = 320;

export const getHeightPercentage = designValue => {
  return SCREEN_HEIGHT * designValue / DESIGNS_HEIGHT;
};

export const getWidthPercentage = designValue => {
  return SCREEN_WIDTH * designValue / DESIGNS_WIDTH;
};

export const isAndroid = () => PLATFORM_NAME === 'android';
export const isIOS = () => PLATFORM_NAME === 'ios';
export const getDistanceBetweenPointsInMeters =  (lat1, lon1, lat2, lon2) => {
  const p = 0.017453292519943295;    // Math.PI / 180
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p)/2 +
    c(lat1 * p) * c(lat2 * p) *
    (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)) * 1000; // 2 * R; R = 6371 km
};
