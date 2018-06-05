

export const CREATE_EVENT_ACTION = 'CREATE_EVENT_ACTION';
export const createEvent = localEvent => ({
  type: CREATE_EVENT_ACTION,
  payload: localEvent,
});

export const CREATE_EVENT_SUCCESS = 'CREATE_EVENT_SUCCESS';
export const createEventDone = event => ({
  type: CREATE_EVENT_SUCCESS,
  payload: event,
});

export const CREATE_EVENT_ERROR = 'CREATE_EVENT_ERROR';
export const createEventError = error => ({
  type: CREATE_EVENT_ERROR,
  payload: error,
});
