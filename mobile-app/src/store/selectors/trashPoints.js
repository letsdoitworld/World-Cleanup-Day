import { createSelector } from 'reselect';

const getState = state => state.toJS();

const trashPointsSelector = createSelector(getState, state => state.trashPoints);

export const getTrashPointsEntity = createSelector(
    trashPointsSelector,
    trashPoints => trashPoints.trashPoints,
);