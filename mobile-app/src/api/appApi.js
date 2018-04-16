import { API_ENDPOINTS } from '../shared/constants';

import Api from '../services/Api';

async function fetchDatasets() {
  try {
    const response = await Api.get(API_ENDPOINTS.FETCH_DATASETS, {
      withToken: false,
    });

    return response.data;
  } catch (ex) {
    throw ex;
  }
}

export default {
  fetchDatasets,
};
