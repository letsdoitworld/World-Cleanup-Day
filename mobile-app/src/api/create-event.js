import Api from '../services/Api';

export async function createEvent(event) {
    try {
        const response = await Api.put('/event', event);
        //console.warn('Responce create', response);
        return response.data;
    } catch (ex) {
        throw ex;
    }
}

export default {
    createEvent
}