import _ from 'lodash';
import axios from 'axios';

import Api, {handleApiError} from './Api';

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
                throw {error: 'Could not read authentification response data'};
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
        .catch((error) => {
            const response = error.response;
            if (response.data && _.isArray(response.data) && response.data.length > 0) {
                const error = response.data[0];
                if (error.code && error.code === 'AUTH_ACCOUNT_IS_LOCKED') {
                    throw error;
                }
            } else {
                handleApiError(error);
            }
        })
}
