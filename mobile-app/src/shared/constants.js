import {Dimensions, PixelRatio, Platform, StatusBar} from 'react-native';

const window = Dimensions.get('window');

export { API_URL } from '../../env';
export { COUNTRY_LIST, COUNTRIES_HASH } from './countries';


export const GOOGLE_GEOCODE_API_URL =
  'https://maps.google.com/maps/api/geocode/json';
export const API_KEY = 'AIzaSyCrUdei3NecMdATo4yTR8FUnphSMMJ2MSg';

export const STATUS_BAR_HEIGHT = Platform.select({
  android: StatusBar.currentHeight,
  ios: 0,
});

export const SCREEN_WIDTH = window.width;
export const SCREEN_HEIGHT = window.height;
export const DIAGONALE_IN_PX = Math.sqrt(Math.pow(SCREEN_WIDTH, 2) + Math.pow(SCREEN_HEIGHT, 2));

const original = PixelRatio.getPixelSizeForLayoutSize(Math.sqrt(Math.pow(28, 2) + Math.pow(38, 2)));
export const MARKER_DIAGONALE_IN_PX =  2 * original;
export const PLATFORM_NAME = Platform.OS;
export const ICON_COLOR = '#a1a1a1';
export const WHITE_COLOR = '#fff';
export const BLACK_COLOR = 'rgb(40, 38, 51)';
export const SIZE_16 = 16;
export const SIZE_20 = 20;
export const SIZE_18 = 18;
export const SIZE_24 = 24;
export const DEFAULT_ZOOM = 0.002;
export const MIN_ZOOM = 0.0004;
export const NO_LOCATION_ZOOM = 30;
export const EDIT_LOCATION_BOUND = 100; // meters
export const MARKER_STATUSES = {
  CLEANED: 'cleaned',
  OUTDATED: 'outdated',
  REGULAR: 'regular',
  THREAT: 'threat',
  USER: 'user',
  CHANGE_LOCATION: 'changeLocation',
};
export const TRASH_COMPOSITION_TYPES_HASH = {
  plastic: 'Plastic',
  Plastic: 'plastic',
  metal: 'Metal',
  Metal: 'metal',
  glass: 'Glass',
  Glass: 'glass',
  electronics: 'Electronics',
  Electronics: 'electronics',
  paper: 'Paper/Wood',
  'Paper/Wood': 'paper/wood',
  tyres: 'Tyres',
  Tyres: 'tyres',
  'domestic waste': 'Domestic waste',
  'Domestic waste': 'domestic waste',
  furniture: 'Furniture',
  Furniture: 'furniture',
  'organic waste': 'Organic waste',
  'Organic waste': 'organic waste',
};

export const TRASH_COMPOSITION_TYPE_LIST = [
  { type: 'plastic', label: 'Plastic' },
  { type: 'metal', label: 'Metal' },
  { type: 'glass', label: 'Glass' },
  { type: 'electronics', label: 'Electronics' },
  { type: 'paper', label: 'Paper/Wood' },
  { type: 'tyres', label: 'Tyres' },
  { type: 'domestic waste', label: 'Domestic waste' },
  { type: 'furniture', label: 'Furniture' },
  { type: 'organic waste', label: 'Organic waste' },
];

export const AMOUNT_HASH = {
  handful: 'label_trash_amount_handful',
  bagful: 'label_trash_amount_bagful',
  cartload: 'label_trash_amount_cartloadl',
  truckload: 'label_trash_amount_truckload',
};

export const ERRORS = {
  404: 'There was an error on the server.',
};

export const GENERIC_SERVER_ERROR = 'There was an error on the server';

export const DATASETS_TYPES = {
  TRASHPOINTS: 'trashpoints',
};

export const API_ENDPOINTS = {
  FETCH_DATASETS: '/datasets',
  USER_ME: '/me',
  USER_AUTH: '/auth/external',
  FETCH_OVERVIEW_CLUSTERS: '/overview/clusters',
  FETCH_OVERVIEW_TRASHPOINTS: '/overview/trashpoints',
  CREATE_TRASHPOINT: '/trashpoints',
  UPDATE_TRASHPOINT: trashpointId => `/trashpoints/${trashpointId}`,
  FETCH_USERS_TRASHPOINTS: `/trashpoints/user`,
  FETCH_TRASHPOINT_DETAILS: trashpointId => `/trashpoints/${trashpointId}`,
  FETCH_TRASHPOINT_IMAGES: trashpointId =>
    `/trashpoints/${trashpointId}/images`,
  DELETE_IMAGE: (trashpointId, imageId) =>
    `/trashpoints/${trashpointId}/images/${imageId}`,
  FETCH_CLUSTER_TRASHPOINTS: '/overview/trashpoints/grid',
  OVERVIEW_TRASHPOINTS_CLUSTERS: '/overview/clusters',
  FETCH_MAP_EVENTS: '/events/overview',
    FETCH_EVENT_IMAGES: eventId =>
        `/event/${eventId}/images`,
    EVENT: '/event',
    FETCH_EVENTS: '/overview/events',
    FETCH_OVERVIEW_EVENT_CLUSTERS: '/overview/events/clusters',
    FETCH_CLUSTER_EVENTS: '/overview/events/grid',
};

export const TRASHPOINT_IMAGE_TYPES = {
  THUMBNAIL: 'thumbnail',
  MEDIUM: 'medium',
};

export const SCREENS = {
  HOME: 'Home',
  PUBLIC_HOME: 'PublicHome',
  MY_ACTIVITY: 'MyActivity',
  DETAILS: 'Details',
};

export default {
    BASE_HEADER: {
        'Content-Type': 'application/json',
    },
    TITLE_REGEX: /^[\S\s]{1,70}$/,
    COORDINATOR_REGEX: /^[\S\s]{1,70}$/,
    DESCRIPTION_REGEX: /^[\S\s]{1,500}$/,
    EMAIL_REGEX: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

    PHONE_NUMBER: /^[+]*\d{6,20}$/

}

export const GRID_HASH = {
  50: '1m',
  100: '5m',
  200: '10m',
  300: '20m',
  400: '30m',
  500: '50m',
  1700: '100m',
  3000: '200m',
  4000: '300m',
  4500: '500m',
  12000: '1km',
  25000: '2km',
  35000: '3km',
  45000: '5km',
  90000: '10km',
  135000: '20km',
  270000: '30km',
  380000: '50km',
  450000: '100km',
  480000: '160km',
  950000: '200km',
  1500000: '300km',
  1750000: '500km',

  '1m': 50,
  '5m': 100,
  '10m': 200,
  '20m': 300,
  '30m': 400,
  '50m': 500,
  '100m': 1700,
  '200m': 3000,
  '300m': 4000,
  '500m': 4500,
  '1km': 12000,
  '2km': 25000,
  '3km': 35000,
  '5km': 45000,
  '10km': 90000,
  '20km': 135000,
  '30km': 270000,
  '50km': 380000,
  '100km': 450000,
  '160km': 480000,
  '200km': 950000,
  '300km': 1500000,
  '500km': 1750000,
};

export const DELTA_HASH = {
  50: {
    latitudeDelta: 0.0002863318668175907,
    longitudeDelta: 0.0002514570951461792,
  },
  100: {
    latitudeDelta: 0.0006253329601548785,
    longitudeDelta: 0.0005491822957992554,
  },
  200: {
    latitudeDelta: 0.001226243092858681,
    longitudeDelta: 0.00107690691947937,
  },
  300: {
    latitudeDelta: 0.002008145227968328,
    longitudeDelta: 0.00176355242729187,
  },
  400: {
    latitudeDelta: 0.002736890669844172,
    longitudeDelta: 0.00240325927734375,
  },
  500: {
    latitudeDelta: 0.003711282058958432,
    longitudeDelta: 0.003258883953094482,
  },
  1700: {
    latitudeDelta: 0.01107219976680796,
    longitudeDelta: 0.009724348783493042,
  },
  3000: {
    latitudeDelta: 0.01475728491076467,
    longitudeDelta: 0.01296043395996094,
  },
  4000: {
    latitudeDelta: 0.02704022218924962,
    longitudeDelta: 0.02374827861785889,
  },
  4500: {
    latitudeDelta: 0.03323047568750326,
    longitudeDelta: 0.02968903630971198,
  },
  12000: {
    latitudeDelta: 0.08446308821030613,
    longitudeDelta: 0.07205989211797714,
  },
  25000: {
    latitudeDelta: 0.16942346637211614,
    longitudeDelta: 0.14452848583459854,
  },
  35000: {
    latitudeDelta: 0.2579797961382866,
    longitudeDelta: 0.22022578865289688,
  },
  45000: {
    latitudeDelta: 0.30250257668247826,
    longitudeDelta: 0.2583359554409981,
  },
  90000: {
    latitudeDelta: 0.41238960755230636,
    longitudeDelta: 0.36818448454141617,
  },
  135000: {
    latitudeDelta: 0.9749836181294285,
    longitudeDelta: 0.8730620518326795,
  },
  270000: {
    latitudeDelta: 1.790686265172674,
    longitudeDelta: 1.5933474898338353,
  },
  380000: {
    latitudeDelta: 2.3224345612026056,
    longitudeDelta: 2.0750926807522774,
  },
  450000: {
    latitudeDelta: 3.0123450416548607,
    longitudeDelta: 2.6738975197076797,
  },
  480000: {
    latitudeDelta: 3.649570939221597,
    longitudeDelta: 3.111969977617264
  },
  950000: { latitudeDelta: 7.438098893575727, longitudeDelta: 9.286720231175423 },
  1500000: { latitudeDelta: 11.71877894364489, longitudeDelta: 15.01618623733521 },
  1750000: { latitudeDelta: 13.73698652411373, longitudeDelta: 16.42137944698334 }
};

export const GRID_VALUES = [
  50,
  100,
  200,
  300,
  400,
  500,
  1700,
  3000,
  4000,
  4500,
  12000,
  25000,
  35000,
  45000,
  90000,
  135000,
  270000,
  380000,
  450000,
  480000,
  950000,
  1500000,
  1750000
];

export const USER_ROLES = {
  VOLUNTEER: 'volunteer',
  LEADER: 'leader',
  SUPERADMIN: 'superadmin',
};

