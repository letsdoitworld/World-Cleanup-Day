import { createSelector } from 'reselect';

const stateSelector = state => state.toJS();

export const errorSelector = createSelector(stateSelector, state => state.error);

export const errorHandle = createSelector(
  errorSelector,
  error => error.error,
);
