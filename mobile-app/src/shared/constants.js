import { Platform, Dimensions, StatusBar } from 'react-native';

const window = Dimensions.get('window');

export { API_URL } from '../../env';

export const GOOGLE_GEOCODE_API_URL = 'https://maps.google.com/maps/api/geocode/json';
export const API_KEY = 'AIzaSyCrUdei3NecMdATo4yTR8FUnphSMMJ2MSg';

export const STATUS_BAR_HEIGHT = Platform.select({
  android: StatusBar.currentHeight,
  ios: 0,
});

export const SCREEN_WIDTH = window.width;
export const SCREEN_HEIGHT = window.height;
export const PLATFORM_NAME = Platform.OS;
export const ICON_COLOR = '#a1a1a1';
export const WHITE_COLOR = '#fff';
export const SIZE_16 = 16;
export const SIZE_20 = 20;
export const SIZE_18 = 18;
export const SIZE_24 = 24;
export const DEFAULT_ZOOM = 0.002;
export const MARKER_STATUSES = {
  CLEANED: 'cleaned',
  OUTDATED: 'outdated',
  REGULAR: 'regular',
  THREAT: 'regular',
  USER: 'user',
  CHANGE_LOCATION: 'changeLocation',
};
