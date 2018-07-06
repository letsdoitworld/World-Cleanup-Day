import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  fetchTeam
} from '../../store/actions/teams';

import {
  updateProfileTeam
} from '../../store/actions/profile';

import { getTeam, getLoader } from '../../store/selectors/teams';
import { getProfileTeam, isConnected } from '../../store/selectors';
import Component from './Team';

const selector = createStructuredSelector({
  team: getTeam,
  loading: getLoader,
  myTeam: getProfileTeam,
  isConnected: isConnected,
});

const actions = {
  onFetchTeam: fetchTeam,
  onUpdateProfileTeam: updateProfileTeam,
};

export default connect(selector, actions)(Component);