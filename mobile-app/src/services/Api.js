import axios from 'axios';

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
  constructor() {
    this.createNetworkInstances();
  }

  // helpers for setting useful defaults
  setBaseURL(baseURL) {
    this.baseURL = baseURL;
    this.createNetworkInstances();
  }
  setAuthToken(authToken) {
    this.authToken = authToken;
    this.createNetworkInstances();
  }

  createNetworkInstances() {
    this.axios = createAxiosInstance({ baseURL: this.baseURL, authToken: this.authToken });
    this.publicAxios = createAxiosInstance({ baseURL: this.baseURL });
  }

  getApiInstance(withToken) {
    return withToken ? this.axios : this.publicAxios;
  }
  get(url, { withToken = true, ...config }) {
    return this.getApiInstance(withToken).get(url, config);
  }
  post(url, data, { withToken = true, ...config }) {
    return this.getApiInstance(withToken).post(url, data, config);
  }
}

export default new ApiService();
