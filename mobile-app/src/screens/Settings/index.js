import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { updateProfileStatus } from '../../store/actions/profile';

import { getProfileEntity } from '../../store/selectors';

import Component from './Settings';

const selector = createStructuredSelector({
    profile: getProfileEntity,
});

const actions = {
    onUpdateProfileStatus: updateProfileStatus,
};

export default connect(selector, actions)(Component);