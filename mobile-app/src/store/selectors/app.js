import { createSelector } from 'reselect';

const stateSelector = state => state.toJS();

export const appSelector = createSelector(stateSelector, state => state.app);

export const isLoading = createSelector(appSelector, app => app.progress);

export const datasetUUID = createSelector(
    appSelector,
    app => app.datasetUUID,
);