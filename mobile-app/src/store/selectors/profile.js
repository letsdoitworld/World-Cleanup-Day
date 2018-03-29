import {createSelector} from 'reselect';

import moment from 'moment';

//import { selectors as trashpileSelector } from '../trashpile';

// import { COUNTRY_LIST, USER_ROLES } from '../../shared/constants';

const getState = state => state.toJS();

const profileSelector = createSelector(getState, state => state.profile);

export const getProfileEntity = createSelector(
  profileSelector,
  profile => profile.entity,
);

export const isPrivateProfile = createSelector(
  getProfileEntity,
  entity => entity && !entity.public,
);

export const loadMyEventsEntity = createSelector(
    profileSelector,
    profile =>
        profile.myEvents && profile.myEvents.listMyEvents && profile.myEvents.listMyEvents.sort(
            (a, b) => moment(b.createDate).diff(moment(a.createDate)),
        ),
);

export const getMyEventsPageSize = createSelector(
    profileSelector,
    profile => profile.myEvents && profile.myEvents.pageSize,
);

export const getMyEventsPageNumber = createSelector(
    profileSelector,
    profile => profile.myEvents && profile.myEvents.pageNumber,
);

export const loadMyEventsErrorEntity = createSelector(
    profileSelector,
    profile => profile.myEventsError,
);

export const loadMyTrashPointsEntity = createSelector(
    profileSelector,
    profile => profile.myTrashPoints && profile.myTrashPoints.listMyTrashPoints,
);

export const getMyTrashpointsPageSize = createSelector(
    profileSelector,
    profile => profile.myTrashPoints && profile.myTrashPoints.pageSize,
);

export const getMyTrashpointsPageNumber = createSelector(
    profileSelector,
    profile => profile.myTrashPoints && profile.myTrashPoints.pageNumber,
);


export const loadMyTrashPointsErrorEntity = createSelector(
    profileSelector,
    profile => profile.myTrashPointsError,
);
