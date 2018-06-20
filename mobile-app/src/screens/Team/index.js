import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  fetchTeam
} from '../../store/actions/teams';

import { getTeam, getLoader } from '../../store/selectors/teams';
import Component from './Team';

const selector = createStructuredSelector({
  team: getTeam,
  loading: getLoader,
});

const actions = {
  onFetchTeam: fetchTeam,
};

export default connect(selector, actions)(Component);