import { createSelector } from 'reselect';

const stateSel = state => state.trashpile;
const markersSel = createSelector(stateSel, state => state.markers);
const adminSel = createSelector(stateSel, state => state.admin);
const detailsSel = createSelector(stateSel, state => state.details);
const markerAreasSel = createSelector(stateSel, state => state.markerAreas);

const getAreasTrashpoints = createSelector(
  markerAreasSel,
  state => state.areasTrashpoints.markers,
);
const canLoadMoreAreasTrashpoints = createSelector(
  markerAreasSel,
  state => state.areasTrashpoints.canLoadMore,
);
const getStatusCounts = createSelector(
  markerAreasSel,
  state => state.areasTrashpoints.statusCounts,
);

const getAllMarkers = createSelector(markersSel, state => state.markers);
const getMarkerDetails = createSelector(detailsSel, state => state.marker);
const getAdminMarkers = createSelector(adminSel, state => state.markers);
const getAdminTrashpointsLoading = createSelector(
  adminSel,
  state => state.loading,
);
const canLoadMoreAdminTrashpoints = createSelector(
  adminSel,
  state => state.canLoadMore,
);

const getGridValue = createSelector(stateSel, state => state.grid);

const mapSelector = createSelector(stateSel, state => state.map);
const getFocusedLocation = createSelector(
  mapSelector,
  state => state.focusedLocation,
);

export default {
  getAllMarkers,
  getAdminMarkers,
  getMarkerDetails,
  getAdminTrashpointsLoading,
  canLoadMoreAdminTrashpoints,
  getGridValue,
  getFocusedLocation,
  getAreasTrashpoints,
  canLoadMoreAreasTrashpoints,
  getStatusCounts,
};
