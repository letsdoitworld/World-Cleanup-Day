export const GOOGLE_MAPS_API_KEY = 'AIzaSyD0AC9TcY3xdmRsc_atlSHRreEbnEbxPEA';
export const GOOGLE_LOGIN_ID =
'701152837929-1lqjqlhu9v3lho6vh3bsen3qbine2l8n.apps.googleusercontent.com';
export const FACEBOOK_APP_ID = '340116156418708';
export const googleMapURL = `https://maps.googleapis.com/maps/api/js?v=3.27&libraries=places,geometry&key=${GOOGLE_MAPS_API_KEY}`;
export const DEFAULT_ZOOM_LEVEL = 7;
export const NO_PERMISSION_ZOOM_LEVEL = 8;
export const ESTONIA_CENTER_COORDINATES = { lat: 48.5953, lng: 35.0136 };
export const MARKER_DIAGONALE_IN_PX = 2 * Math.sqrt(Math.pow(28, 2) + Math.pow(38, 2));
export const FOCUS_EVENT_ZOOM_LEVEL = 14;
export const MAX_ZOOM_LEVEL = 22;
export const DATASETS_TYPES = {
  EVENTS: 'events',
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
  FETCH_USERS_TRASHPOINTS: '/trashpoints/user',
  FETCH_TRASHPOINT_DETAILS: trashpointId => `/trashpoints/${trashpointId}`,
  FETCH_TRASHPOINT_IMAGES: trashpointId =>
    `/trashpoints/${trashpointId}/images`,
  DELETE_IMAGE: (trashpointId, imageId) =>
    `/trashpoints/${trashpointId}/images/${imageId}`,
  FETCH_USERS: ({ page, pageSize, area, nameSearch }) =>
    `/users?pageNumber=${page}&pageSize=${pageSize}${area ? `&country=${area}` : ''}${nameSearch ? `&nameSearch=${nameSearch}` : ''}`,
  FETCH_USER_BY_ID: id => `/users/${id}`,
  FETCH_ADMIN_TRASHPOINTS: '/admin/trashpoints',
  FETCH_CLUSTER_TRASHPOINTS: '/overview/trashpoints/grid',
  LOCK_USER: userId => `/users/${userId}/lock`,
  FETCH_AREA_TRASHPOINTS: areaId => `/areas/${areaId}/trashpoints`,
  FETCH_EVENTS: '/overview/events',
  FETCH_EVENT_DETAILS: eventId => `/event/${eventId}`,
  FETCH_OVERVIEW_EVENT_CLUSTERS: '/overview/events/clusters',
};
export const BACKEND_LOGIN_SOURCES = {
  FACEBOOK: 'facebook',
  GOOGLE: 'google',
};

export const MARKER_STATUSES = {
  cleaned: 'cleaned',
  outdated: 'outdated',
  regular: 'regular',
  threat: 'threat',
};

export const TRASHPOINT_IMAGE_TYPES = {
  THUMBNAIL: 'thumbnail',
  MEDIUM: 'medium',
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

export const AMOUNT_STATUSES = {
  handful: 0,
  bagful: 1,
  cartload: 2,
  truckload: 3,
  0: 'handful',
  1: 'bagful',
  2: 'cartload',
  3: 'truckload',
};

export const SHARED_MODAL_STYLES = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0px 0px 15px 2px rgba(0,0,0,0.3)',
  },
};

export const USER_ROLES = {
  VOLUNTEER: 'volunteer',
  LEADER: 'leader',
  SUPERADMIN: 'superadmin',
};

export const GRID_MIN_VALUE = 50;

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
  850000: '200km',
  900000: '500km',

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
  '200km': 850000,
  '500km': 900000,
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
  850000: {
    latitudeDelta: 4.826367019845939,
    longitudeDelta: 4.32493194937706,
  },
  900000: {
    latitudeDelta: 4.59693647594942,
    longitudeDelta: 13.51318359375,
  },
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
  850000,
];
