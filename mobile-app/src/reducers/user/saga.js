import {call, put, take} from "redux-saga/effects";
import types from './types';
import {fetchNetworkTokenAsync, SOCIAL_NETWORKS} from "../../services/Login";

import appActions from '../app/actions'

import strings from "../../assets/strings"
import actions from "./actions";
import {facebookLogin, getProfile, googleLogin, updateProfileStatus} from "./operations";
import Api from "../../services/Api";
import {login, BACKEND_LOGIN_SOURCES} from "../../services/Login";

function* loginGoogle() {
    try {
        const user = yield call(googleLogin);
        const accessToken = user.accessToken;
        const cleanUpToken = yield call(login, BACKEND_LOGIN_SOURCES.GOOGLE, accessToken);
        yield put(actions.setToken(cleanUpToken));
    } catch (error) {
        appActions.setErrorMessage(String(error));
    }
}

export function* loginGoogleFlow() {
    while (true) {

        yield take(types.GOOGLE_LOGIN_ACTION);
        yield call(loginGoogle);


        // const {name, secondName, role} = yield take(types.CREATE_PROFILE_ACTION);
        // yield put(rootActions.controlProgress(true));
        // yield call(createProfile, name, secondName, role);
        // yield put(rootActions.controlProgress(false));
    }
}

function* loginFacebook() {
    try {
        const token = yield call(facebookLogin);
        const accessToken = token.accessToken;
        const cleanUpToken = yield call(login, BACKEND_LOGIN_SOURCES.FACEBOOK, accessToken);
        yield put(actions.setToken(cleanUpToken));
    } catch (error) {
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
        yield take(types.FB_LOGIN_ACTION);
        yield call(loginFacebook);


        // const {name, secondName, role} = yield take(types.CREATE_PROFILE_ACTION);
        // yield put(rootActions.controlProgress(true));
        // yield call(createProfile, name, secondName, role);
        // yield put(rootActions.controlProgress(false));
    }
}

function* loadProfile() {
    try {
        const response = yield call(getProfile);
        yield put(actions.fetchProfileDone(response))
    } catch (error) {
        appActions.setErrorMessage(String(error));
    }
}

export function* loadProfileFlow() {
    while (true) {
        yield take(types.FETCH_PROFILE);
        yield call(loadProfile);
    }
}

function* updateStatus(profileStatus) {
    try {
        const status = yield call(updateProfileStatus, profileStatus);
    } catch (error) {
        console.warn(error);
        appActions.setErrorMessage(error)
    }
}

export function* updateProfileStatusFlow() {
    while (true) {
        const {profileStatus} = yield take(types.UPDATE_PROFILE_STATUS_ACTION);
        yield call(updateStatus, profileStatus)
    }
}