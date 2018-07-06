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
  authToken = '';
  baseURL = '';

  constructor() {
    this.createNetworkInstances();
  }

  setBaseURL(baseURL) {
    this.baseURL = baseURL;
    this.createNetworkInstances();
  }

  setAuthToken(authToken) {
    this.authToken = authToken;
    this.createNetworkInstances();
  }

  createNetworkInstances() {
    this.axios = createAxiosInstance({
      baseURL: this.baseURL,
      authToken: this.authToken,
    });
    this.publicAxios = createAxiosInstance({ baseURL: this.baseURL });
  }

  getApiInstance(withToken) {
    return withToken ? this.axios : this.publicAxios;
  }
  async get(url, data, options = { withToken: true }) {
    try {
      return await this.getApiInstance(options.withToken).get(
        url,
        data,
      );
    } catch (e) {
      console.log(e);
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
      console.log(e);
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
      console.log(e);
    }
  }

  async delete(url) {
    try {
      return await this.getApiInstance(true).delete(url);
    } catch (e) {
      console.log(e);
    }
  }
}

// export const BASE_URL = 'https://api-staging.app.worldcleanupday.com/api/v1'

let BASE_URL;
if (process.env.NODE_ENV === 'development') {
  switch (window.location.host) {
    case 'localhost:3000':
      BASE_URL = `${window.location.protocol}//api-staging.app.worldcleanupday.com/api/v1`;
      break;
    default:
      BASE_URL = `${window.location.protocol}//${window.location.host}:50000/api/v1`;
  }
} else {
  switch (window.location.host) {
    case 'staging.app.worldcleanupday.com':
      BASE_URL = `${window.location.protocol}//api-${window.location.host}/api/v1`;
      break;
    case 'app.worldcleanupday.com':
      BASE_URL = `${window.location.protocol}//api.${window.location.host}/api/v1`;
      break;
    default:
      BASE_URL = `${window.location.protocol}//api-${window.location.host}/api/v1`;
  }
}

export {
  BASE_URL,
};

const apiService = new ApiService();
apiService.setBaseURL(BASE_URL);

export default apiService;
