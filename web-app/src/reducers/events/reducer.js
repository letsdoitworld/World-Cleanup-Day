import { combineReducers } from 'redux';
import TYPES from './types';
import events from './events.json'

const EVENTS_INITIAL_STATE = {
  events: events,
  loading: false,
  error: false,
  showEventWindow: true
};

const eventsReducer = (state = EVENTS_INITIAL_STATE, action)=> {
  switch(action.type) {
    case TYPES.TOGGLE_EVENT_WINDOW:
      return {...state, showEventWindow: !state.showEventWindow}
    default:
      return state;
  }
}

const eventDetailsReducer = (state = [], action)=> {
  return state
}

export default combineReducers({
  events: eventsReducer,
  details: eventDetailsReducer
});
