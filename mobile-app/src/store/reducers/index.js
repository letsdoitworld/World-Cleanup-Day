// import { combineReducers } from 'redux';
import { combineReducers } from 'redux-immutable';

import auth from './auth';
import profile from './profile';

export default combineReducers({
  auth,
  profile,
});
