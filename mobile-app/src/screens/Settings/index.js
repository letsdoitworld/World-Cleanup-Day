import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { updateProfileStatus } from '../../store/actions/profile';

import { logout } from '../../store/actions/auth';

import { getProfileEntity, isPrivateProfile } from '../../store/selectors';

import Component from './Settings';

const selector = createStructuredSelector({
  isPrivateProfile,
  profile: getProfileEntity,
});

const actions = {
  onUpdateProfileStatus: updateProfileStatus,
  onLogout: logout,
};

export default connect(selector, actions)(Component);
