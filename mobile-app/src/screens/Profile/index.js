import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { fetchProfile } from '../../store/actions/profile';

import { getProfileEntity } from '../../store/selectors';

import Component from './Profile';

const selector = createStructuredSelector({
  profile: getProfileEntity,
});

const actions = {
  onFetchProfile: fetchProfile,
};

export default connect(selector, actions)(Component);
