import { createSelector } from 'reselect';

const getState = state => state.toJS();

const trashPointsSelector = createSelector(getState, state => state.trashPoints);

export const getTrashPointsEntity = createSelector(
    trashPointsSelector,
    trashPoints => trashPoints.trashPoints,
);

export const getMapTrashPointsEntity = createSelector(
    trashPointsSelector,
    events => events.mapTrashPoints,
);

export const showTrashPointsNewDeltaEntity = createSelector(
    trashPointsSelector,
    events => events.mapTrashPoints,
);