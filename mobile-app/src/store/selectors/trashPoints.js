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

export const showTrashPointsNewDeltaEntity = createSelector(
  trashPointsSelector,
  trashPoints => trashPoints.mapTrashPoints,
);

export const noTrashPoints = createSelector(
  trashPointsSelector,
  trashPoints => trashPoints.empty,
);
