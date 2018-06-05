import { combineReducers } from 'redux-immutable';

import auth from './auth';
import profile from './profile';
import createEvent from './createEvent';
import app from './app';
import trashPoints from './trashPoints';
import events from './events';
import locations from './locations';
import createTrashPoint from './createTrashPoint';
import error from './error';


export default combineReducers({
  auth,
  profile,
  createEvent,
  app,
  trashPoints,
  locations,
  events,
  createTrashPoint,
  error,
});
