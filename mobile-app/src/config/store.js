import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import { autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';

import {
  mapReducer,
  userReducer,
  trashpileReducer,
  authReducer,
  appReducer,
} from '../reducers';

const rootReducer = combineReducers({
  map: mapReducer,
  user: userReducer,
  trashpile: trashpileReducer,
  auth: authReducer,
  app: appReducer,
});

const resetStateOnSignOutReducer = reducer => (state, action) => {
  const userWasSignedOut = action.meta && action.meta.logout;
  if (!userWasSignedOut) {
    return reducer(state, action);
  }
  // Note how we can purge sensitive data without hard reload easily.
  const stateWithoutSensitiveData = {
    auth: undefined,
    map: undefined,
    user: undefined,
    trashpile: state.thrashpile,
  };
  return reducer(stateWithoutSensitiveData, action);
};

export default createStore(
  resetStateOnSignOutReducer(rootReducer),
  undefined,
  composeWithDevTools(
    applyMiddleware(thunk),
    // autoRehydrate()
  ),
);
