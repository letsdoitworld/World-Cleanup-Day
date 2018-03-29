import Api from "../services/Api";

async function loadEvent(id) {
    try {
        const response = await Api.get(`/event/${id}`,
            {
                withToken: true,
            });
        if (!response || !response.data) {
            throw { error: 'Could not load my events' };
        }
        return response.data;
    } catch (ex) {
        throw ex;
    }
}

export async function searchEventsRequest(query, page, pageSize, location) {
    try {
        const response = await Api.get('/events',
            {
                params: {
                    pageSize: pageSize,
                    pageNumber: page + 1,
                    location: location,
                    name: query
                },
            },
            {
                withToken: false,
            },);
        if (!response || !response.data) {
            throw {error: 'Could not load my events'};
        }
        return response;
    } catch (ex) {
        throw ex
    }
}

export default {
  searchEventsRequest,
  loadEvent,
};
