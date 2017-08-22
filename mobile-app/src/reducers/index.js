import appReducer from './app';
import { locationReducer } from './location';
import { trashpileReducer } from './trashpile';

export { default as userReducer } from './user';

export { trashpileReducer, appReducer, locationReducer };
