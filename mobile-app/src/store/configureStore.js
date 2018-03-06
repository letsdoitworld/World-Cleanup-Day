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
} from './sagas';

import {
    authReducer,
    authInitialState,
    profileReducer,
    profileInitialState,
    profileStatusReducer,
    profileStatusInitialState,
} from '../reducers/user/reducers';

import {
    errorInitialState,
} from '../reducers/app/reducers';

import { initialProfileState } from './reducers/profile';
import { initialAuthState } from './reducers/auth';


// const combinedReducers = combineReducers({
//     auth: authReducer,
//     profile: profileReducer,
//     profileState: profileStatusReducer,
//     //network: networkReducer,
//     // config: configReducer,
//     error: errorReducer,
//     //  popover: popoverReducer,

//     // root: rootReducer,
//     // login: loginReducer,
//     // list: listReducer,
//     // profile: profileReducer,
//     // school: schoolReducer,
//     // categoryFeed: categoryFeedReducer,
//     // editGroups: editGroupsReducer,
//     // dashboard: dashboardReducer,
//     // notifications: notificationsReducer,
//     // events: eventsReducer,
//     // schoolCategories: schoolCategoriesReducer
// });

export const initialState = new Immutable.Map({
  auth: initialAuthState,
  profile: initialProfileState,
    // profileState: Immutable.Map(profileStatusInitialState),
//   error: Immutable.Map(errorInitialState),

    // root: Immutable.Map({
    //     progress: undefined,
    //     root_screen: 'welcome'
    // }),
    // login: Immutable.Map({
    //     isLoggedIn: false,
    //     token: '',
    //     loginError: {},
    //     username: '',
    //     user: {},
    //     password: '',
    //     authorizationId: ''
    // }),
    // list: Immutable.Map({
    //     data: [],
    //     sellers: [],
    //     items: []
    // }),
    // profile: Immutable.Map({
    //     profile: undefined,
    // }),
    // school: Immutable.Map({
    //     school: {},
    //     error: '',
    //     schools: []
    // }),
    // categoryFeed:Immutable.Map({
    //     dataMap: {},
    //     error: ''
    // }),
    // editGroups:Immutable.Map({
    //     data: [],
    //     groups: [],
    //     error: ''
    // }),
    // dashboard:Immutable.Map({
    //     recommendedFeed: [],
    //     myFeed: [],
    //     mySchools: [],
    //     error: ''
    // }),
    // notifications:Immutable.Map({
    //     notifications: [],
    //     error: ''
    // }),
    // events:Immutable.Map({
    //     data: {},
    //     dates: [],
    //     error: ''
    // }),
    // schoolCategories:Immutable.Map({
    //     categories: [],
    //     error: '',
    // }),
});


export default function configureStore() {

    const sagaMiddleware = createSagaMiddleware();

    const store = createStore(
        reducers,
        // initialState,
        compose(applyMiddleware(sagaMiddleware, createActionBuffer(REHYDRATE)), autoRehydrate({ log: true })));


    persistStore(
        store,
        {
            storage: AsyncStorage,
            // blacklist:['editGroups', 'school', 'events']
        }
    );
    return {
        ...store,
        runSaga: [
            sagaMiddleware.run(loginGoogleFlow),
            sagaMiddleware.run(loginFacebookFlow),
            sagaMiddleware.run(updateProfileStatusFlow),
            sagaMiddleware.run(loadProfileFlow),
            // sagaMiddleware.run(listSaga.listFlow),
            // sagaMiddleware.run(listSaga.sellersListFlow),
            // sagaMiddleware.run(listSaga.itemsListFlow),
            // sagaMiddleware.run(logoutSaga.logoutFlow),
            // sagaMiddleware.run(profileSaga.createProfileFlow),
            // sagaMiddleware.run(schoolSaga.schoolFlow),
            // sagaMiddleware.run(profileSaga.loadProfileFlow),
            // sagaMiddleware.run(profileSaga.editProfileFlow),
            // sagaMiddleware.run(categoryFeedSaga.getCategoryFeedFlow),
            // sagaMiddleware.run(logoutSaga.logoutFlow),
            // sagaMiddleware.run(editGroupsSaga.editGroupsFlow),
            // sagaMiddleware.run(editGroupsSaga.subscribeGroupsFlow),
            // sagaMiddleware.run(editGroupsSaga.loadGroupsFlow),
            // sagaMiddleware.run(dashboardSaga.recommendedFeedFlow),
            // sagaMiddleware.run(dashboardSaga.myFeedFlow),
            // sagaMiddleware.run(dashboardSaga.mySchoolsFlow),
            // sagaMiddleware.run(schoolSaga.searchSchoolsFlow),
            // sagaMiddleware.run(schoolSaga.followedSchoolsFlow),
            // sagaMiddleware.run(schoolSaga.subscribeSchoolFlow),
            // sagaMiddleware.run(schoolSaga.sortSchoolsFlow),
            // sagaMiddleware.run(notificationsSaga.notificationsFlow),
            // sagaMiddleware.run(notificationsSaga.notificationsMarkFlow),
            // sagaMiddleware.run(eventsSaga.eventsFlow),
            // sagaMiddleware.run(schoolCategoriesSaga.schoolCategoriesFlow)
        ]
    };
}