import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  fetchTeams,
} from '../../store/actions/teams';
import { guestLogIn } from '../../store/actions/auth';

import {
  getTeams,
  getLoader,
} from '../../store/selectors/teams';

import {
  getUserCountry,
  isAuthenticated,
  isGuestSession,
} from '../../store/selectors';

import Component from './Teams';

const selector = createStructuredSelector({
  teams: getTeams,
  loading: getLoader,
  country: getUserCountry,
  isAuthenticated,
  isGuestSession,
});

const actions = {
  onFetchTeams: fetchTeams,
  onGuestLogIn: guestLogIn,
};

export default connect(selector, actions)(Component);
