import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { guestLogIn } from '../../store/actions/auth';

import { fetchProfile } from '../../store/actions/profile';

import { fetchUserLocation } from '../../store/actions/locations';

import {
  getProfileEntity,
  isAuthenticated,
  isGuestSession,
  getUserCountry,
} from '../../store/selectors';

import Component from './Profile';

const selector = createStructuredSelector({
  profile: getProfileEntity,
  country: getUserCountry,
  isAuthenticated,
  isGuestSession,
});

const actions = {
  onFetchProfile: fetchProfile,
  onGuestLogIn: guestLogIn,
  onFetchLocation: fetchUserLocation,
};

export default connect(selector, actions)(Component);
