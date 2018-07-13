import _ from 'lodash';
import axios from 'axios';

import Api from './Api';

export const BACKEND_LOGIN_SOURCES = {
  FACEBOOK: 'facebook',
  GOOGLE: 'google',
};

export function login(network, token) {
  return axios.post(`${Api.baseURL}/auth/external`, {
    source: network,
    token,
  })
    .then((response) => {
      if (!_.has(response, 'data.token')) {
        throw new Error('Could not read authentification response data');
      } else {
        return response;
      }
    })
    .then((response) => {
      return response.data.token;
    })
    .then((networkToken) => {
      Api.setAuthToken(networkToken);
      return networkToken;
    })
    .catch((e) => {
      const response = e.response;
      if (response.data && _.isArray(response.data) && response.data.length > 0) {
        const error = response.data[0];
        if (error.code && error.code === 'AUTH_ACCOUNT_IS_LOCKED') {
          throw error;
        }
      } else {
        throw new Error(e);
      }
    });
}
