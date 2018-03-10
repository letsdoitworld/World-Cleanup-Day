import {autoRehydrate, persistStore} from "redux-persist-immutable";
import {combineReducers} from "redux-immutable";
import createActionBuffer from "redux-action-buffer";
import {REHYDRATE} from "redux-persist/constants";
import Immutable from "immutable";
import {applyMiddleware, compose, createStore} from "redux";
import {AsyncStorage} from "react-native";
import createSagaMiddleware from "redux-saga";

import reducers from './reducers';

import {
    loginGoogleFlow,
    loginFacebookFlow,
    updateProfileStatusFlow,
    loadProfileFlow,
    createEventFlow,
    searchTrashPointsFlow
} from './sagas';

export default function configureStore() {

    const sagaMiddleware = createSagaMiddleware();

    const store = createStore(
        reducers,
        compose(applyMiddleware(sagaMiddleware, createActionBuffer(REHYDRATE)), autoRehydrate({log: true})));


    persistStore(
        store,
        {
            storage: AsyncStorage,
            blacklist:['trashPoints',]
        }
    );
    return {
        ...store,
        runSaga: [
            sagaMiddleware.run(loginGoogleFlow),
            sagaMiddleware.run(loginFacebookFlow),
            sagaMiddleware.run(updateProfileStatusFlow),
            sagaMiddleware.run(loadProfileFlow),
            sagaMiddleware.run(createEventFlow),
            sagaMiddleware.run(searchTrashPointsFlow)
        ]
    };
}