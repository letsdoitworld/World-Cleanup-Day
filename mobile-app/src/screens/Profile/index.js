import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { guestLogIn } from '../../store/actions/auth';

import { fetchProfile } from '../../store/actions/profile';

import { getProfileEntity, isAuthenticated, isGuestSession } from '../../store/selectors';

import Component from './Profile';

const selector = createStructuredSelector({
  profile: getProfileEntity,
  isAuthenticated,
  isGuestSession,
});

const actions = {
  onFetchProfile: fetchProfile,
  onGuestLogIn: guestLogIn,
};

export default connect(selector, actions)(Component);
