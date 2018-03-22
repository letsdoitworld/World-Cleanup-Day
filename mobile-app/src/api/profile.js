import Api from '../services/Api';
import {API_ENDPOINTS} from "../shared/constants";

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
            throw {error: 'Could not not read response data'};
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
                    pageSize: pageSize,
                    pageNumber: pageNumber,
                },
            },
            {
                withToken: true,
            },);
        //console.warn("loadMyEvents api", response.data.records);
        if (!response || !response.data) {
            throw {error: 'Could not load my events'};
        }
        return response.data.records;
    } catch (ex) {
        //console.warn("loadMyEvents api error", ex);
        throw ex
    }
}

async function loadMyTrashPoints(pageSize, pageNumber) {
    try {
        const response = await Api.get(API_ENDPOINTS.FETCH_USERS_TRASHPOINTS, {
                withToken: true,
            },
            {
                params: {
                    pageSize,
                    pageNumber: reset ? 1 : pageNumber,
                },
            },
        );
        if (!response || !response.data) {
            throw {error: 'Could not load my events'};
        }
        return response.data;
    } catch(ex) {
        throw ex
    }

}

export default {
    updateProfileStatus,
    getProfile,
    updateProfile,
    loadMyEvents,
    loadMyTrashPoints,
};

