import {
    SEARCH_TRASH_POINTS_ACTION,
    SEARCH_TRASH_POINTS_ERROR_ACTION,
    SEARCH_TRASH_POINTS_SUCCESS_ACTION
} from './types';

export const searchTrashPointsAction = (query, page, pageSize, location) => ({
    type: SEARCH_TRASH_POINTS_ACTION,
    query,
    page,
    pageSize,
    location
});

export const searchTrashPointsSuccessAction = (trashPoints) => ({
    type: SEARCH_TRASH_POINTS_SUCCESS_ACTION,
    trashPoints
});

export const searchTrashPointsErrorAction = (error) => ({
    type: SEARCH_TRASH_POINTS_ERROR_ACTION,
    error
});