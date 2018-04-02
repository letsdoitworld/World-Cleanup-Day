import {API_ENDPOINTS, DATASETS_TYPES} from "../shared/constants";
import types from "../reducers/app/types";
import Api from "../services/Api";

async function fetchDatasets() {
    try {
        const response = await Api.get(API_ENDPOINTS.FETCH_DATASETS, {
            withToken: false,
        });

        return response.data;
    } catch (ex) {
        throw ex;
    }
};

export default {
    fetchDatasets,
}