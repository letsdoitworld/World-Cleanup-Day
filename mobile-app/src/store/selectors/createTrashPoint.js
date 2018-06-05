import { createSelector } from 'reselect';

const getState = state => state.toJS();

const trashPointsSelector = createSelector(getState, state => state.createTrashPoint);

export const getCreateTrashPointEntity = createSelector(
  trashPointsSelector,
  createTrashPoint => createTrashPoint,
);
