import Api from '../services/Api';

async function createEvent(event) {
  try {
    const response = await Api.put('/event', event);
    return response.data;
  } catch (ex) {
    console.log(ex);
  }
}

export default {
  createEvent,
};
