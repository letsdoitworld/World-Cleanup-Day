import { createSelector } from 'reselect';

const getState = state => state.toJS();

const eventsSelector = createSelector(getState, state => state.events);

export const getEventsEntity = createSelector(
  eventsSelector,
  events => events.events,
);

export const getEmptyEventsEntity = createSelector(
  eventsSelector,
  events => events.events
    && events.events
      .map((event) => { if (!event.photos[0]) return event; return undefined; })
      .filter((event) => { return typeof event !== 'undefined'; }),
);

export const getEventEntity = createSelector(
  eventsSelector,
  events => events.currentEvent,
);

export const getEventsTrashpoints = createSelector(
  eventsSelector,
  events => events.currentEvent && events.currentEvent.trashpoints,
);

export const getErrorEvent = createSelector(
  eventsSelector,
  events => events.errors && events.errors.errorEvent,
);

export const getMapEventsEntity = createSelector(
  eventsSelector,
  events => events.mapEvents,
);

export const showNewDeltaEntity = createSelector(
  eventsSelector,
  events => events.newDelta,
);

export const noEvents = createSelector(
  eventsSelector,
  events => events.empty,
);

export const updatedViewPort = createSelector(
  eventsSelector,
  events => events.viewPort,
);

export const updatedRegion = createSelector(
  eventsSelector,
  events => events.updatedRegion,
);
