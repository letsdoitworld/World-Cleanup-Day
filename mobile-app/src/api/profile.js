import Api from '../services/Api';
import { API_ENDPOINTS } from '../shared/constants';

async function updateProfileStatus(profileStatus) {
  try {
    const response = await Api.put('me/privacy', profileStatus);

    return response.data;
  } catch (ex) {
    throw ex;
  }
}

async function getProfile() {
  try {
    const response = await Api.get('/me');
    return response.data;
  } catch (ex) {
    throw ex;
  }
}

async function updateProfile(profile) {
  try {
    const response = await Api.put('/me', profile);
    if (!response || !response.data) {
      throw new Error('Could not not read response data');
    }
    return response.data;
  } catch (ex) {
    throw ex;
  }
}

async function loadMyEvents(pageSize, pageNumber) {
  try {
    const response = await Api.get('events/user',
      {
        params: {
          pageSize,
          pageNumber,
        },
      },
      {
        withToken: true,
      });
    if (!response || !response.data) {
      throw new Error('Could not not read response data');
    }
    return response.data.records;
  } catch (ex) {
    throw ex;
  }
}

async function loadMyTrashPoints(pageSize, pageNumber) {
  try {
    const response = await Api.get(API_ENDPOINTS.FETCH_USERS_TRASHPOINTS, {
      params: {
        pageSize,
        pageNumber,
      },
    },
    {
      withToken: true,
    },
    );
    if (!response || !response.data) {
      throw new Error('Could not load my events');
    }
    return response.data;
  } catch (ex) {
    throw ex;
  }
}

export default {
  updateProfileStatus,
  getProfile,
  updateProfile,
  loadMyEvents,
  loadMyTrashPoints,
};

