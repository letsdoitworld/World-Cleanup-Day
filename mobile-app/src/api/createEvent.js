import Api from '../services/Api';

async function createEvent(event) {
  try {
    const response = await Api.put('/event', event);
    console.log("createEvent", response);
    return response.data;
  } catch (ex) {
    console.log(ex);
  }
}

export default {
  createEvent,
};
