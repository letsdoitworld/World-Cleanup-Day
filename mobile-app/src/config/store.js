import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import { autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';

import {
  locationReducer,
  trashpileReducer,
  appReducer,
  userReducer,
  teamsReducer,
} from '../reducers';

const rootReducer = combineReducers({
  location: locationReducer,
  trashpile: trashpileReducer,
  app: appReducer,
  user: userReducer,
  teams: teamsReducer,
});

const resetStateOnSignOutReducer = reducer => (state, action) => {
  const userWasSignedOut = action.meta && action.meta.logout;
  if (!userWasSignedOut) {
    return reducer(state, action);
  }
  // Note how we can purge sensitive data without hard reload easily.
  const stateWithoutSensitiveData = {
    app: state.app,
    user: undefined,
    location: state.location,
    trashpile: state.trashpile,
    teams: state.teams,
  };
  return reducer(stateWithoutSensitiveData, action);
};

export default createStore(
  resetStateOnSignOutReducer(rootReducer),
  undefined,
  composeWithDevTools(applyMiddleware(thunk), autoRehydrate()),
);
