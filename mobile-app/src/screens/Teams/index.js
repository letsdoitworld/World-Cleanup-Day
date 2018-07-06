import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'recompose';

import {
  fetchTeams,
} from '../../store/actions/teams';

import {
  getTeams,
  getLoader,
} from '../../store/selectors/teams';

import {
  getUserCountry, isConnected
} from '../../store/selectors';

import Component from './Teams';
import { withNetworkGuard } from '../../services/Network';

const selector = createStructuredSelector({
  teams: getTeams,
  loading: getLoader,
  country: getUserCountry,
  isConnected: isConnected,
});

const actions = {
  onFetchTeams: fetchTeams,
};


export default compose(
  withNetworkGuard(),
  connect(selector, actions),
)(Component);