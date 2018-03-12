import {combineReducers} from 'redux-immutable';

import auth from './auth';
import profile from './profile';
import createEvent from './create-event-reducer';
import app from './app';
import trashPoints from './trashPoints';


export default combineReducers({
    auth,
    profile,
    createEvent,
    app,
    trashPoints,
});
