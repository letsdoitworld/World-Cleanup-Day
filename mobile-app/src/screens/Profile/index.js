import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';

import {guestLogIn} from '../../store/actions/auth';

import {fetchProfile, loadMyEvents, loadMyTrashPoints, loadMyTrashPointsError,} from '../../store/actions/profile';

import {setErrorMessage} from '../../store/actions/app'

import {
    errorHandle,
    getMyEventsPageNumber,
    getMyEventsPageSize,
    getMyTrashpointsPageNumber,
    getMyTrashpointsPageSize,
    getProfileEntity,
    getUserCountry,
    isAuthenticated,
    isGuestSession,
    loadMyEventsEntity,
    loadMyEventsErrorEntity,
    loadMyTrashPointsEntity,
    loadMyTrashPointsErrorEntity,
} from '../../store/selectors';

import Component from './Profile';

const selector = createStructuredSelector({
  profile: getProfileEntity,
  country: getUserCountry,
  eventsPageSize: getMyEventsPageSize,
  eventsPageNumber: getMyEventsPageNumber,
  trashpointsPageSize: getMyTrashpointsPageSize,
  trashpointsPageNumber: getMyTrashpointsPageNumber,
  myEvents: loadMyEventsEntity,
  error: errorHandle,
  myEventsError: loadMyEventsErrorEntity,
  myTrashPoints: loadMyTrashPointsEntity,
  myTrashPointsError: loadMyTrashPointsErrorEntity,
  isAuthenticated,
  isGuestSession,
});

const actions = {
  onFetchProfile: fetchProfile,
  onGuestLogIn: guestLogIn,
  onLoadMyEvents: loadMyEvents,
  onLoadMyTrashPoints: loadMyTrashPoints,
  onLoadMyTrashPointsError: loadMyTrashPointsError,
  onSetError: setErrorMessage,
};

export default connect(selector, actions)(Component);
