import { createSelector } from 'reselect';

const stateSel = state => state.events;
const eventsSel = createSelector(stateSel, state => state.events);

const getAllEvents = createSelector(
  eventsSel,
  state => state.events
);

const getShowEventWindow = createSelector(
  eventsSel,
  state => state.showEventWindow
);

export default {
  getAllEvents,
  getShowEventWindow
};
