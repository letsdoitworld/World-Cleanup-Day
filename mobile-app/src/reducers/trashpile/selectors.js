import { createSelector } from 'reselect';

const stateSelector = state => state.toJS();//.trashpile;
// this is used since the state was split into 2, in order to
// separate the user trashpoints from the rest of the state
const legacySelector = createSelector(
  stateSelector,
  state => state.trashPoints,
);

const trashpointsSelector = createSelector(
  legacySelector,
  state => state.markers,
);
const clustersSelector = createSelector(
  legacySelector,
  state => state.clusters,
);
export const markersSelector = createSelector(
  trashpointsSelector,
  clustersSelector,
  (trashpoints, clusters) => {
    return [...trashpoints, ...clusters];
  },
);

const markerDetailsSelector = createSelector(
  legacySelector,
  state => state.markerDetails,
);
const getMarkerCreatorId = createSelector(
  markerDetailsSelector,
  details => details.createdBy,
);
const isLoading = createSelector(legacySelector, state => state.loading);
const detailsLoading = createSelector(
  legacySelector,
  state => state.loadingMarkers,
);

const userTrashpointsSelector = createSelector(
  stateSelector,
  state => state.userTrashpoints,
);

const userTrashpoints = createSelector(
  userTrashpointsSelector,
  state => state.trashpoints,
);
const userTrashpointsLoading = createSelector(
  userTrashpointsSelector,
  state => state.loading,
);
const userTrashpointsError = createSelector(
  userTrashpointsSelector,
  state => state.error,
);
const userTrashpointsInitialLoaded = createSelector(
  userTrashpointsSelector,
  state => state.initialLoad,
);
const userTrashpointsNextPage = createSelector(
  userTrashpointsSelector,
  state => state.page || 1,
);
const userTrashpointsPageSize = createSelector(
  userTrashpointsSelector,
  state => state.pageSize,
);
const userTrashpointsCanLoadMore = createSelector(
  userTrashpointsSelector,
  state => !state.endReached,
);
const userTrashpointsRefreshing = createSelector(
  userTrashpointsSelector,
  state => state.refreshing,
);
const getLastDeltaValue = createSelector(legacySelector, state => state.delta);
const getMarkerDeleting = createSelector(
  legacySelector,
  state => state.markerDeleting,
);

export default {
  stateSelector,
 // markersSelector,
  markerDetailsSelector,
  userTrashpointsSelector,
  getMarkerCreatorId,
  isLoading,
  getLastDeltaValue,

  userTrashpoints,
  userTrashpointsLoading,
  userTrashpointsError,
  userTrashpointsInitialLoaded,
  userTrashpointsNextPage,
  userTrashpointsPageSize,
  userTrashpointsCanLoadMore,
  userTrashpointsRefreshing,

  getMarkerDeleting,
};
