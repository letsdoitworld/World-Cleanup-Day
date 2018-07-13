import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  setGuestSession,
  loginFacebook,
  loginGoogle,
} from '../../store/actions/auth';

import Component from './Login';

const selector = createStructuredSelector({});

const actions = {
  onSetGuestSession: setGuestSession,
  onLoginFacebook: loginFacebook,
  onLoginGoogle: loginGoogle,
};


export default connect(selector, actions)(Component);
