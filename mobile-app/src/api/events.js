import axios from "axios/index";
import Api from "../services/Api";

export async function searchEventsRequest(query, page, pageSize, location) {
    try {
        const response = await Api.get('events',
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
}