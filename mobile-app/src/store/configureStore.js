import { autoRehydrate, persistStore } from 'redux-persist-immutable';
import createActionBuffer from 'redux-action-buffer';
import { REHYDRATE } from 'redux-persist/constants';
import { applyMiddleware, compose, createStore } from 'redux';
import { AsyncStorage } from 'react-native';
import createSagaMiddleware from 'redux-saga';

import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

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
} from './sagas';


export default function configureStore() {
  let store;
  const sagaMiddleware = createSagaMiddleware();
  const enhancer = compose(
    applyMiddleware(sagaMiddleware, createActionBuffer(REHYDRATE)),
    autoRehydrate({ log: true }),
  );


  if (__DEV__) {
    Reactotron.configure({ name: 'CleanUp' })
        .use(reactotronRedux())
        .connect();

    const yeOldeConsoleLog = console.log;
    console.log = (...args) => {
      yeOldeConsoleLog(...args);
      Reactotron.display({
        name: 'CONSOLE.LOG',
        value: args,
        preview: args.length > 0 && typeof args[0] === 'string' ? args[0] : null,
      });
    };

    store = Reactotron.createStore(reducers, enhancer);
  } else {
    store = createStore(reducers, enhancer);
  }


  persistStore(
        store,
    {
      storage: AsyncStorage,
      blacklist: ['trashPoints', 'events'],
    },
  );

  return {
    ...store,
    runSaga: [
      sagaMiddleware.run(loginGoogleFlow),
      sagaMiddleware.run(loginFacebookFlow),
      sagaMiddleware.run(updateProfileStatusFlow),
      sagaMiddleware.run(loadProfileFlow),
      sagaMiddleware.run(logoutFlow),
      sagaMiddleware.run(createEventFlow),
      sagaMiddleware.run(searchTrashPointsFlow),
      sagaMiddleware.run(searchEventsFlow),
      sagaMiddleware.run(loadLocationFlow),
    ],
  };
}
