import { createSelector } from 'reselect';

//import { selectors as trashpileSelector } from '../trashpile';

// import { COUNTRY_LIST, USER_ROLES } from '../../shared/constants';

const getState = state => state.toJS();

const eventsSelector = createSelector(getState, state => state.events);

export const getEventsEntity = createSelector(
    eventsSelector,
    events => events.events,
);