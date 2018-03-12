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

export const getEventDetails = createSelector(
  detailsSel,
  state => state.event,
);

export const getCurrentMarkerID = createSelector(
  detailsSel,
  state => state.event.datasetId,
);

export const getEventTitle = createSelector(
  detailsSel,
  state => state.event.title,
);

export default {
  getAllEvents,
  getAllEventMarkers,
  getShowEventWindow,
  getEventTitle,
  getCurrentMarkerID,
  getEventDetails,
};
