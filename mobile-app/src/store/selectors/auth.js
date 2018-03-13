import { createSelector } from 'reselect';

const stateSelector = state => state.toJS();

export const authSelector = createSelector(stateSelector, state => state.auth);

export const isAuthenticated = createSelector(authSelector, auth => !!auth.token);

export const isGuestSession = createSelector(authSelector, auth => auth.isGuestSession);

export const getToken = createSelector(authSelector, auth => auth.token);
