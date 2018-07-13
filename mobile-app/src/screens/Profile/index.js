import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { guestLogIn } from '../../store/actions/auth';

import {
  fetchProfile,
  loadMyEvents,
  loadMyTrashPoints,
  loadMyTrashPointsError,
  updateCountryProfile,
} from '../../store/actions/profile';

import {
  clearEventsAction,
} from '../../store/actions/events';

import { setErrorMessage } from '../../store/actions/error';

import {
  errorHandle,
  getMyEventsPageNumber,
  getMyEventsPageSize,
  getMyTrashpointsPageNumber,
  getMyTrashpointsPageSize,
  getProfileEntity,
  getUserCountry,
  getCountryCode,
  isAuthenticated,
  isGuestSession,
  loadMyEventsEntity,
  loadMyEventsLoadingEntity,
  loadMyEventsErrorEntity,
  loadMyTrashPointsEntity,
  loadMyTrashPointsLoadingEntity,
  loadMyTrashPointsErrorEntity,
  loadMyEmptyEventsEntity,
  getTerms, getCreateTrashPointEntity,
} from '../../store/selectors';

import Component from './Profile';

const selector = createStructuredSelector({
  profile: getProfileEntity,
  country: getUserCountry,
  countryCode: getCountryCode,
  eventsPageSize: getMyEventsPageSize,
  eventsPageNumber: getMyEventsPageNumber,
  trashpointsPageSize: getMyTrashpointsPageSize,
  trashpointsPageNumber: getMyTrashpointsPageNumber,
  myEvents: loadMyEventsEntity,
  myEmptyEvents: loadMyEmptyEventsEntity,
  error: errorHandle,
  myEventsLoading: loadMyEventsLoadingEntity,
  myEventsError: loadMyEventsErrorEntity,
  myTrashPoints: loadMyTrashPointsEntity,
  myTrashPointsLoading: loadMyTrashPointsLoadingEntity,
  myTrashPointsError: loadMyTrashPointsErrorEntity,
  isAuthenticated,
  isGuestSession,
  allowed: getTerms,
  createTrashPoint: getCreateTrashPointEntity,
});

const actions = {
  onFetchProfile: fetchProfile,
  onGuestLogIn: guestLogIn,
  onLoadMyEvents: loadMyEvents,
  onLoadMyTrashPoints: loadMyTrashPoints,
  onLoadMyTrashPointsError: loadMyTrashPointsError,
  onSetError: setErrorMessage,
  updateProfileCountry: updateCountryProfile,
  onClearEvents: clearEventsAction,
};

export default connect(selector, actions)(Component);
