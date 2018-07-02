import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  fetchTeams,
} from '../../store/actions/teams';

import {
  getTeams,
  getLoader,
} from '../../store/selectors/teams';

import {
  getUserCountry
} from '../../store/selectors';

import Component from './Teams';

const selector = createStructuredSelector({
  teams: getTeams,
  loading: getLoader,
  country: getUserCountry,
});

const actions = {
  onFetchTeams: fetchTeams,
};

export default connect(selector, actions)(Component);