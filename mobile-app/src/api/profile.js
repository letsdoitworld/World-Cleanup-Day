import Api from '../services/Api';

export async function updateProfileStatus(profileStatus) {
  try {
    const response = await Api.get('me/privacy', profileStatus);
    return response;
  } catch (ex) {
    throw ex;
  }
}

export async function getProfile() {
  console.log('getProfile API');
  try {
    const response = await Api.get('/me');
    console.log('Responce', response);
    return response.data;
  } catch (ex) {
    throw ex;
  }
}

export async function updateProfile(profile) {
  try {
    const response = await Api.put('/me', profile);
    if (!response || !response.data) {
      throw { error: 'Could not not read response data' };
    }
    return response.data;
  } catch (ex) {
    throw ex;
  }
}

