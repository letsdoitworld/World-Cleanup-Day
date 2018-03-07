import Api from '../services/Api';

export async function createEvent(event) {
    try {
        const response = await Api.put('/event', event);
        console.log('Responce', response);
        return response.data;
    } catch (ex) {
        throw ex;
    }
}