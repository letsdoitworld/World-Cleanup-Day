// import { combineReducers } from 'redux';
import {combineReducers} from 'redux-immutable';

import auth from './auth';
import profile from './profile';
import createEvent from './create-event-reducer';

export default combineReducers({
    auth,
    profile,
    createEvent
});
