/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import { BASE_URL } from 'react-native-dotenv';
import { setErrorMessage } from '../store/actions/error';
import { logout } from '../store/actions/auth';

const createAxiosInstance = ({ authToken, baseURL }) => {
  const config = {};
  if (authToken) {
    config.headers = { Authorization: `Bearer ${authToken}` };
  }
  if (baseURL) {
    config.baseURL = baseURL;
  }
  return axios.create(config);
};

class ApiService {
  authToken = '';
  baseURL = BASE_URL;

  constructor() {
    this.createNetworkInstances();
  }

  setBaseURL = (baseURL) => {
    this.baseURL = baseURL;
    this.createNetworkInstances();
  }

  setAuthToken = (authToken) => {
    this.authToken = authToken;
    this.createNetworkInstances();
  }

  createNetworkInstances = () => {
    this.axios = createAxiosInstance({
      baseURL: this.baseURL,
      authToken: this.authToken,
    });
    this.publicAxios = createAxiosInstance({ baseURL: this.baseURL });
  }

  handleApiError = (error) => {
    if (error && error.response && error.response.status === 403) {
      // resetTo(rootNav, 'Login');
      logout();
    } else {
      setErrorMessage(error.message);
    }
  }
  getApiInstance(withToken) {
    return withToken ? this.axios : this.publicAxios;
  }

  async get(url, axiosOptions, options = { withToken: true }) {
    try {
      return await this.getApiInstance(options.withToken).get(
        url,
        axiosOptions,
      );
    } catch (e) {
      throw e;
    }
  }

  async post(url, data, options = { withToken: true }, headers) {
    try {
      return await this.getApiInstance(options.withToken).post(
        url,
        data,
        headers,
      );
    } catch (e) {
      throw e;
    }
  }

  async put(url, data, options = { withToken: true }, headers) {
    try {
      return await this.getApiInstance(options.withToken).put(
        url,
        data,
        headers,
      );
    } catch (e) {
      throw e;
    }
  }

  async delete(url) {
    try {
      return await this.getApiInstance(true).delete(url);
    } catch (e) {
      throw e;
    }
  }
}

export default new ApiService();
