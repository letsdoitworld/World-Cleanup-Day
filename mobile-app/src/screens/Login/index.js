import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { setGuestSession, loginFacebook, loginGoogle } from '../../store/actions/auth';

import { isAuthenticated } from '../../store/selectors';

import Component from './Login';

const selector = createStructuredSelector({
  isAuthenticated,
});

const actions = {
  onSetGuestSession: setGuestSession,
  onLoginFacebook: loginFacebook,
  onLoginGoogle: loginGoogle,
};


export default connect(selector, actions)(Component);
