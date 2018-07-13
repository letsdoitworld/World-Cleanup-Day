import { createSelector } from 'reselect';

const getState = state => state.toJS();

const trashPointsSelector = createSelector(getState, state => state.trashPoints);

export const getTrashPointsEntity = createSelector(
  trashPointsSelector,
  trashPoints => trashPoints.trashPoints,
);

export const getMapTrashPointsEntity = createSelector(
  trashPointsSelector,
  trashPoints => trashPoints.mapTrashPoints,
);
export const getTrashpointEntity = createSelector(
  trashPointsSelector,
  trashPoints => trashPoints.currentTrashPoint,
);
export const showTrashPointsNewDeltaEntity = createSelector(
  trashPointsSelector,
  trashPoints => trashPoints.mapTrashPoints,
);

export const noTrashPoints = createSelector(
  trashPointsSelector,
  trashPoints => trashPoints.empty,
);

export const getTrashPointImagesEntity = createSelector(
  trashPointsSelector,
  trashPoints => trashPoints.trashPointImages,
);

export const getTrashPointDetailsEntity = createSelector(
  trashPointsSelector,
  trashPoints => trashPoints.trashPointDetails,
);
