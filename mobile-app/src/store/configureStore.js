/* eslint-disable import/no-extraneous-dependencies,no-undef */
import { autoRehydrate, persistStore } from 'redux-persist-immutable';
import createActionBuffer from 'redux-action-buffer';
import { REHYDRATE } from 'redux-persist/constants';
import { applyMiddleware, compose, createStore } from 'redux';
import { AsyncStorage } from 'react-native';
import createSagaMiddleware from 'redux-saga';

import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers';

import {
  autoRegidrateFlow,
  createEventFlow,
  createTrashPointFlow,
  fetchDataFromOneClusterFlow,
  fetchDatasetFlow,
  fetchTrashPointsDataFromOneClusterFlow,
  getMapEventsFlow,
  getMapTrashPointsFlow,
  loadEventFlow,
  loadLocationFlow,
  loadMyEventsFlow,
  loadMyTrashPointsFlow,
  loadProfileFlow,
  loginFacebookFlow,
  loginGoogleFlow,
  logoutFlow,
  searchEventsFlow,
  searchTrashPointsFlow,
  updateProfileStatusFlow,
  requestTermsFlow,
  updateTrashPointFlow,
  joinEventFlow,
  getTrashPointImagesFlow,
  deleteTrashPointImageFlow,
  fetchTrashpointFlow,
  deleteTrashPointFlow,
  updateProfileFlow,
  getTrashPointDetailsFlow,
  deleteEventFlow,
  loadTeamsFlow,
  loadTeamFlow,
  updateProfileTeamFlow,
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
      blacklist: [
        'trashPoints',
        'events',
        'myEvents',
        'createTrashPoint',
        'error',
      ],
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
      sagaMiddleware.run(updateTrashPointFlow),
      sagaMiddleware.run(getTrashPointImagesFlow),
      sagaMiddleware.run(deleteTrashPointImageFlow),
      sagaMiddleware.run(deleteTrashPointFlow),
      sagaMiddleware.run(getTrashPointDetailsFlow),
      sagaMiddleware.run(loadEventFlow),
      sagaMiddleware.run(getMapEventsFlow),
      sagaMiddleware.run(fetchDatasetFlow),
      sagaMiddleware.run(fetchDataFromOneClusterFlow),
      sagaMiddleware.run(getMapTrashPointsFlow),
      sagaMiddleware.run(fetchTrashPointsDataFromOneClusterFlow),
      sagaMiddleware.run(requestTermsFlow),
      sagaMiddleware.run(fetchTrashpointFlow),
      sagaMiddleware.run(joinEventFlow),
      sagaMiddleware.run(updateProfileFlow),
      sagaMiddleware.run(deleteEventFlow),
      sagaMiddleware.run(loadTeamsFlow),
      sagaMiddleware.run(loadTeamFlow),
      sagaMiddleware.run(updateProfileTeamFlow),
    ],
  };
}
