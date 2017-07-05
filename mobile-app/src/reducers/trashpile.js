import axios from 'axios';

import { GOOGLE_GEOCODE_API_URL, API_KEY, API_URL } from '../shared/constants';

const CHANGE_LOCATION = 'trashpile/CHANGE_LOCATION';

const FETCH_TRASHPILE_ADDRESS_REQUEST = 'FETCH_TRASHPILE_ADDRESS_REQUEST';
const FETCH_TRASHPILE_ADDRESS_SUCCESS = 'FETCH_TRASHPILE_ADDRESS_SUCCESS';
const FETCH_TRASHPILE_ADDRESS_FAILURE = 'FETCH_TRASHPILE_ADDRESS_FAILURE';

const FETCH_TRASHPILE_GENERIC_TYPES_REQUEST =
  'FETCH_TRASHPILE_GENERIC_TYPES_REQUEST';
const FETCH_TRASHPILE_GENERIC_TYPES_SUCCESS =
  'FETCH_TRASHPILE_GENERIC_TYPES_SUCCESS';
const FETCH_TRASHPILE_GENERIC_TYPES_FAILURE =
  'FETCH_TRASHPILE_GENERIC_TYPES_FAILURE';

const SET_PREVIEW_ADDRESS = 'trashpile/SET_PREVIEW_ADDRESS';

const INITIAL_STATE = {
  location: undefined,
  address: { completeAddress: '', addressInfo: [] },
  previewAddress: '',
  loading: false,
  types: [],
};

export default (state = { ...INITIAL_STATE }, action) => {
  switch (action.type) {
    case CHANGE_LOCATION: {
      return { ...state, location: action.payload };
    }
    case FETCH_TRASHPILE_ADDRESS_REQUEST:
      return { ...state, loading: true };
    case FETCH_TRASHPILE_ADDRESS_SUCCESS:
      return { ...state, loading: false, address: action.address };
    case FETCH_TRASHPILE_ADDRESS_FAILURE:
      return { ...state, loading: false };
    case SET_PREVIEW_ADDRESS:
      return { ...state, previewAddress: action.payload };
    case FETCH_TRASHPILE_GENERIC_TYPES_SUCCESS:
      return { ...state, types: action.types };
    default:
      return state;
  }
};

// ACTION CREATORS

const setLocation = location => {
  return {
    type: CHANGE_LOCATION,
    payload: location,
  };
};
const setPreviewAddress = address => {
  return {
    type: SET_PREVIEW_ADDRESS,
    payload: address,
  };
};

// utlity function for fetching the address
const fetchAddress = async ({ latitude, longitude }) => {
  const { data } = await axios.get(
    `${GOOGLE_GEOCODE_API_URL}?key=${API_KEY}&latlng=${latitude},${longitude}`,
  );
  let completeAddress = '';
  let streetAddress = '';
  let locality = '';
  let country = '';
  let streetNumber = '';
  let subLocality = '';

  if (data && data.results && data.results.length > 0) {
    completeAddress = data.results[0].formatted_address;
    data.results[0].address_components.forEach(({ types, long_name }) => {
      if (types.indexOf('route') !== -1) {
        streetAddress = long_name;
      } else if (types.indexOf('street_number') !== -1) {
        streetNumber = long_name;
      } else if (types.indexOf('locality') !== -1) {
        locality = long_name;
      } else if (types.indexOf('country') !== -1) {
        country = long_name;
      } else if (types.indexOf('sublocality') !== -1) {
        subLocality = long_name;
      }
    });
  }

  return {
    completeAddress,
    streetAddress,
    locality,
    country,
    streetNumber,
    subLocality,
  };
};

// ACTIONS

export const fetchTrashpileAddress = ({ latitude, longitude }) => {
  return async dispatch => {
    dispatch({ type: FETCH_TRASHPILE_ADDRESS_REQUEST });
    try {
      const address = await fetchAddress({ latitude, longitude });

      dispatch({
        type: FETCH_TRASHPILE_ADDRESS_SUCCESS,
        address,
      });
    } catch (e) {
      console.log(e.message);
      dispatch({ type: FETCH_TRASHPILE_ADDRESS_FAILURE });
    }
  };
};

const fetchPreviewAddress = ({ latitude, longitude }) => async dispatch => {
  const { completeAddress } = await fetchAddress({ latitude, longitude });
  dispatch(setPreviewAddress(completeAddress));
};
const setFullLocation = ({ latitude, longitude }) => async dispatch => {
  dispatch(setLocation({ latitude, longitude }));
  if (fetchAddress) {
    dispatch(fetchTrashpileAddress({ latitude, longitude }));
  }
};

const fetchTrashpileTypes = () => {
  return axios.get(`${API_URL}/types`);
};

const setTrashpileTypes = types => {
  return {
    type: FETCH_TRASHPILE_GENERIC_TYPES_SUCCESS,
    types,
  };
};

export const actions = {
  fetchTrashpileAddress,
  setFullLocation,
  fetchPreviewAddress,
  fetchTrashpileTypes,
  setTrashpileTypes,
};

// SELECTORS
const getLocation = state => {
  return state.location;
};

const getFullAddress = state => {
  return state.address;
};

const getPreviewAddress = state => {
  return state.previewAddress;
};

const getTypes = state => state.types;

export const selectors = {
  getLocation,
  getFullAddress,
  getPreviewAddress,
  getTypes,
};
