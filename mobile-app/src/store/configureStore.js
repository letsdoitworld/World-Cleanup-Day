import { autoRehydrate, persistStore } from 'redux-persist-immutable';
import createActionBuffer from 'redux-action-buffer';
import { REHYDRATE } from 'redux-persist/constants';
import { applyMiddleware, compose, createStore } from 'redux';
import { AsyncStorage } from 'react-native';
import createSagaMiddleware from 'redux-saga';

import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers';

import {
    loginGoogleFlow,
    loginFacebookFlow,
    updateProfileStatusFlow,
    loadProfileFlow,
    logoutFlow,
    createEventFlow,
    searchTrashPointsFlow,
    searchEventsFlow,
    loadLocationFlow,
    autoRegidrateFlow,
    getMapEventsFlow,
    loadMyEventsFlow,
    loadMyTrashPointsFlow,
    createTrashPointFlow,
    fetchDatasetFlow,
    loadEventFlow,
} from './sagas';


export default function configureStore() {
  let enhancer;
  const sagaMiddleware = createSagaMiddleware();


  if (__DEV__) {
    enhancer = composeWithDevTools(
      applyMiddleware(sagaMiddleware, createActionBuffer(REHYDRATE)),
      autoRehydrate({ log: true }),
    );
  } else {
    enhancer = compose(
      applyMiddleware(sagaMiddleware, createActionBuffer(REHYDRATE)),
      autoRehydrate({ log: true }),
    );
  }

  const store = createStore(reducers, enhancer);

  persistStore(
        store,
    {
      storage: AsyncStorage,
      blacklist: ['trashPoints', 'events', 'myEvents', 'errorEvent', 'createTrashPoint'],
    },
  );

  return {
    ...store,
    runSaga: [
      sagaMiddleware.run(autoRegidrateFlow),
      sagaMiddleware.run(loginGoogleFlow),
      sagaMiddleware.run(loginFacebookFlow),
      sagaMiddleware.run(updateProfileStatusFlow),
      sagaMiddleware.run(loadProfileFlow),
      sagaMiddleware.run(logoutFlow),
      sagaMiddleware.run(createEventFlow),
      sagaMiddleware.run(searchTrashPointsFlow),
      sagaMiddleware.run(searchEventsFlow),
      sagaMiddleware.run(loadLocationFlow),
      sagaMiddleware.run(loadMyEventsFlow),
      sagaMiddleware.run(loadMyTrashPointsFlow),
      sagaMiddleware.run(createTrashPointFlow),
      sagaMiddleware.run(loadEventFlow),
      sagaMiddleware.run(getMapEventsFlow),
        sagaMiddleware.run(fetchDatasetFlow),
    ],
  };
}
