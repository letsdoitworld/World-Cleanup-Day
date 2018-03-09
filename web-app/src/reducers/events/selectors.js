import { createSelector } from 'reselect';

const stateSel = state => state.events;
const markersSel = createSelector(stateSel, state => state.markers);
const eventsSel = createSelector(stateSel, state => state.events);
const detailsSel = createSelector(stateSel, state => state.details);

export const getAllEvents = createSelector(
  eventsSel,
  state => state.events,
);

const getShowEventWindow = createSelector(
  eventsSel,
  state => state.showEventWindow,
);

const getAllEventMarkers = createSelector(markersSel, state => state.markers);

const getEventTitle = (state, id) => getAllEvents(state)[id].title;

export const getEventDetails = createSelector(
  detailsSel,
  state => state.event,
);

export default {
  getAllEvents,
  getAllEventMarkers,
  getShowEventWindow,
  getEventTitle,
  getEventDetails,
};
