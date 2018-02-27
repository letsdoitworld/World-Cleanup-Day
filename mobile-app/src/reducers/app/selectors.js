import { createSelector } from 'reselect';

const stateSelector = state => state.app;
const popoverSelector = createSelector(stateSelector, state => state.popover);
const errorSelector = createSelector(stateSelector, state => state.error);
const configSelector = createSelector(stateSelector, state => state.config);

const wasPopoverShown = createSelector(
  popoverSelector,
  popover => !!popover.shown,
);
const getPopoverMessage = createSelector(
  popoverSelector,
  popover => popover.message,
);

const getErrorMessage = createSelector(errorSelector, state => state.message);
const getErrorTitle = createSelector(errorSelector, state => state.title);
const isErrorVisible = createSelector(errorSelector, state => state.visible);

const trashpointsDatasetUUIDSelector = createSelector(
  configSelector,
  state => state.trashpointsDatasetUUID,
);
const getActiveScreen = createSelector(
  configSelector,
  state => state.activeScreen,
);

const networkSelector = createSelector(stateSelector, state => state.network);
const wasConnectionChecked =
  createSelector(networkSelector, state => state.connectionChecked);
const isConnected = createSelector(networkSelector, state => state.isConnected);
const inSync = createSelector(networkSelector, state => state.inSync);

export default {
  wasPopoverShown,
  getPopoverMessage,

  getError: errorSelector,
  getErrorMessage,
  getErrorTitle,
  isErrorVisible,

  trashpointsDatasetUUIDSelector,
  getActiveScreen,

  wasConnectionChecked,
  isConnected,
  inSync
};
