import { createSelector } from 'reselect';

//import { selectors as trashpileSelector } from '../trashpile';

// import { COUNTRY_LIST, USER_ROLES } from '../../shared/constants';

const getState = state => state.toJS();

const createEventSelector = createSelector(getState, state => state.createEvent);

export const getCreateEventEntity = createSelector(
    createEventSelector,
    createEvent => createEvent.event,
);

export const getCreateEventError = createSelector(
    createEventSelector,
    createEvent => createEvent.error,
);

