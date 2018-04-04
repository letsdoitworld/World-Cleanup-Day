import {createSelector} from 'reselect';

const getState = state => state.toJS();

const eventsSelector = createSelector(getState, state => state.events);

export const getEventsEntity = createSelector(
    eventsSelector,
    events => events.events,
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
    events => events.mapEvents,
);