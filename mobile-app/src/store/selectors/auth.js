import { createSelector } from 'reselect';

const stateSelector = state => state.auth;

export const authSelector = createSelector(stateSelector, state => state.auth);

export const isAuthenticated = createSelector(authSelector, auth => !!auth.token);

export const getToken = createSelector(authSelector, auth => auth.token);
