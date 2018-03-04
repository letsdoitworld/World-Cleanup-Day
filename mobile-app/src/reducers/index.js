import appReducer from './app';
import { locationReducer } from './location';
import { trashpileReducer } from './trashpile';
import { teamsReducer } from './teams';

export { default as userReducer } from './user';

export { trashpileReducer, appReducer, locationReducer, teamsReducer };
