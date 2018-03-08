import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';

import {
  trashpileReducer,
  appReducer,
  userReducer,
  adminReducer,
  areaReducer,
} from '../reducers';

const rootReducer = combineReducers({
  trashpile: trashpileReducer,
  app: appReducer,
  user: userReducer,
  admin: adminReducer,
  areas: areaReducer,
});

const resetStateOnSignOutReducer = reducer => (state, action) => {
  const userWasSignedOut = action.meta && action.meta.logout;
  if (!userWasSignedOut) {
    return reducer(state, action);
  }
  // Note how we can purge sensitive data without hard reload easily.
  const stateWithoutSensitiveData = {
    app: undefined,
    user: undefined,
    trashpile: undefined,
    admin: undefined,
    area: undefined,
  };
  return reducer(stateWithoutSensitiveData, action);
};

let composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(
      {
          // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      },
      )
    : compose;

if (process.env.NODE_ENV === 'production') {
  composeEnhancers = compose;
}

const enhancers = composeEnhancers(applyMiddleware(
  thunk,
), autoRehydrate());

export default createStore(resetStateOnSignOutReducer(rootReducer), enhancers);
