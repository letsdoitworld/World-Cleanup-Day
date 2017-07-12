import axios from 'axios';

import { API_URL } from '../shared/constants';

const FETCH_COUNTRIES_SUCCESS = 'FETCH_COUNTRIES_SUCCESS';

const INITIAL_STATE = {
  countries: [],
  loading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_COUNTRIES_SUCCESS:
      return { ...state, countries: action.countries };
    default:
      return state;
  }
};

const fetchCountries = async () => {
  return axios.get(`${API_URL}/countries`);
};

const setCountries = countries => ({ type: FETCH_COUNTRIES_SUCCESS, countries });

export const actions = {
  fetchCountries,
  setCountries,
};

export const selectors = {
  getCountries: state => state.countries,
};
