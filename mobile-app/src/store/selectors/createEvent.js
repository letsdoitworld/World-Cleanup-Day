import { createSelector } from 'reselect';

const getState = state => state.toJS();

export const createEventSelector = createSelector(getState, state => state.createEvent);

export const getCreateEventEntity = createSelector(
    createEventSelector,
    createEvent => createEvent.event,
);

export const getCreateEventError = createSelector(
    createEventSelector,
    createEvent => createEvent.error,
);

