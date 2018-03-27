import { createSelector } from 'reselect';

const getState = state => state.toJS();

const eventsSelector = createSelector(getState, state => state.events);

export const getEventsEntity = createSelector(
    eventsSelector,
    events => events.events,
);