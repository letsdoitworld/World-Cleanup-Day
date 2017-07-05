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
