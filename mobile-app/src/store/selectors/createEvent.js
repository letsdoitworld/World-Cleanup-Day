import { createSelector } from 'reselect';

const getState = state => state.toJS();

const createEventSelector = createSelector(getState, state => state.createEvent);

export const getCreateEventEntity = createSelector(
  createEventSelector,
  createEvent => createEvent.event,
);

export const getCreateEventLoading = createSelector(
  createEventSelector,
  createEvent => createEvent.loading,
);

export const getCreateEventError = createSelector(
  createEventSelector,
  createEvent => createEvent.error,
);

