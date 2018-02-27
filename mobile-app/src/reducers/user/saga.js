import {call, put, take} from "redux-saga/effects";
import types from './types';
import {fetchNetworkTokenAsync, SOCIAL_NETWORKS} from "../../services/Login";

import appActions from '../app/actions'

import strings from "../../assets/strings"
import actions from "./actions";
import {facebookLogin} from "./operations";
import Api from "../../services/Api";

//
// function* createProfile(name, secondName, role) {
//     try {
//         const response = yield call(Api.createProfile, name, secondName, role);
//         if (response.status) {
//             yield put(profileActions.setCreateProfileSuccess(response.profile));
//             return response.profile;
//         } else {
//             const detail = response.errors.detail;
//             yield put(profileActions.setError({message:detail[Object.keys(detail)[0]][0]}));
//             return undefined;
//         }
//     } catch (error) {
//         yield put(profileActions.setError(error));
//     }
// }

function* loginGoogle() {
    try {
        const token = yield call(fetchNetworkTokenAsync, SOCIAL_NETWORKS.GOOGLE);
        yield put(actions.setToken(token));
    } catch (error) {
        console.log(error);
        console.log('error');
       //  if (error.code && error.code === 'AUTH_ACCOUNT_IS_LOCKED') {
       //      yield put(appActions.setErrorMessage(strings.label_locked_account_warning));
       //  } else {
       //      yield put(appActions.setErrorMessage(String(error)));
       // }
    }
}

export function* loginGoogleFlow() {
    while (true) {

        yield take(types.GOOGLE_LOGIN_ACTION);
        yield call(loginGoogle); //look at operations.js



        // const {name, secondName, role} = yield take(types.CREATE_PROFILE_ACTION);
        // yield put(rootActions.controlProgress(true));
        // yield call(createProfile, name, secondName, role);
        // yield put(rootActions.controlProgress(false));
    }
}

function* loginFacebook() {
    try {
        console.warn("TOKEN ");
        const token = yield call(facebookLogin);
        const accessToken = token.accessToken;
        console.warn("Token ", accessToken);
        yield Api.setAuthToken(accessToken);
        yield put(actions.setToken(accessToken));
    } catch (error) {
        console.log(error);
        appActions.setErrorMessage(String(error));
        //  if (error.code && error.code === 'AUTH_ACCOUNT_IS_LOCKED') {
        //      yield put(appActions.setErrorMessage(strings.label_locked_account_warning));
        //  } else {
        //      yield put(appActions.setErrorMessage(String(error)));
        // }
    }
}


export function* loginFacebookFlow() {
    while (true) {
        console.warn("loginFacebookFlow ", call);
        yield take(types.FB_LOGIN_ACTION);
        yield call(loginFacebook); //look at operations.js



        // const {name, secondName, role} = yield take(types.CREATE_PROFILE_ACTION);
        // yield put(rootActions.controlProgress(true));
        // yield call(createProfile, name, secondName, role);
        // yield put(rootActions.controlProgress(false));
    }
}