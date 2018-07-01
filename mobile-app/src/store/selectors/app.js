import { createSelector } from 'reselect';

const stateSelector = state => state.toJS();

export const appSelector = createSelector(stateSelector, state => state.app);

export const isLoading = createSelector(appSelector, app => app.progress);

export const networkSelector = createSelector(appSelector, state => state.network);
export const wasConnectionChecked =
  createSelector(appSelector, state => state.connectionChecked);
export const isConnected = createSelector(appSelector, state => state.isConnected);
export const inSync = createSelector(appSelector, state => state.inSync);
export const isNoLackConnectionAlert = createSelector(appSelector, state => state.noLackConnectionAlert);


export const datasetUUID = createSelector(
  appSelector,
  app => app.datasetUUID,
);
