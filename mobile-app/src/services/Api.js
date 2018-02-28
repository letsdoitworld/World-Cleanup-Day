import axios from 'axios';
import store from '../config/store';
import {operations as appOperations} from '../reducers/app/operations';
import {operations as userOps} from '../reducers/user/operations';
import {GENERIC_SERVER_ERROR, ERRORS} from '../shared/constants';
import {handleSentryError} from '../shared/helpers';

const createAxiosInstance = ({authToken, baseURL}) => {
    const config = {};
    if (authToken) {
        config.headers = {Authorization: `Bearer ${authToken}`};
    }
    if (baseURL) {
        config.baseURL = baseURL;
    }
    return axios.create(config);
};

export const handleApiError = (error) => {
    if (error && error.response && error.response.status === 403) {
        //resetTo(rootNav, 'Login');
        store.dispatch(userOps.logout());
    } else if (error.response && error.response.status) {
        // const message = `${i18n.t(
        //   'label_error_modal_default_subtitle',
        // )} [${error.response.status}]`;
        // store.dispatch(appOperations.setErrorMessage(message));
    } else {
        store.dispatch(appOperations.setErrorMessage(error.message));
    }
};

class ApiService {
    authToken = '';
    baseURL = 'https://api.app.worldcleanupday.com/api/v1';

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
        this.publicAxios = createAxiosInstance({baseURL: this.baseURL});
    }

    // handleErrors(errorSet) {
    //   return errorSet.reduce(({ code }, error) => {
    //     const newError = ERRORS[code];
    //     return `
    //     ${error}
    //     ${newError ? newError : GENERIC_SERVER_ERROR}
    //     `;
    //   }, '');
    // }

    getApiInstance(withToken) {
        return withToken ? this.axios : this.publicAxios;
    }

    async get(url, options = {withToken: true}, axiosOptions) {
        try {
            return await this.getApiInstance(options.withToken).get(
                url,
                axiosOptions,
            );
        } catch (e) {
            handleSentryError(e);
            handleApiError(e);
        }
    }

    async post(url, data, options = {withToken: true}, headers) {
        try {
            return await this.getApiInstance(options.withToken).post(
                url,
                data,
                headers,
            );
        } catch (e) {
            handleSentryError(e);
            handleApiError(e);
        }
    }

    async put(url, data, options = {withToken: true}, headers) {
        try {
            return await this.getApiInstance(options.withToken).put(
                url,
                data,
                headers,
            );
        } catch (e) {
            handleSentryError(e);
            handleApiError(e);
        }
    }

    async delete(url, {skipError = false} = {}) {
        try {
            return await this.getApiInstance(true).delete(url);
        } catch (e) {
            handleSentryError(e);
            if (!skipError) {
                handleApiError(e);
            } else {
                throw e;
            }
        }
    }
}

export default new ApiService();
