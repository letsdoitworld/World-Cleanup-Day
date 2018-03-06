import { call, put, take } from 'redux-saga/effects';

import {
  setErrorMessage,
} from '../actions/app';

import {
  FB_LOGIN_ACTION,
  GOOGLE_LOGIN_ACTION,
  setToken,
} from '../actions/auth';

import {
  facebookLogin,
  googleLogin,
} from '../../api';

import {
  login,
  BACKEND_LOGIN_SOURCES,
} from '../../services/Login';

// import strings from '../../assets/strings';

function* loginGoogle() {
  try {
    const user = yield call(googleLogin);
    const accessToken = user.accessToken;
    const cleanUpToken = yield call(login, BACKEND_LOGIN_SOURCES.GOOGLE, accessToken);
    yield put(setToken(cleanUpToken));
  } catch (error) {
    console.log(error);
    setErrorMessage(String(error));
  }
}

export function* loginGoogleFlow() {
  while (true) {
    yield take(GOOGLE_LOGIN_ACTION);
    yield call(loginGoogle);

        // const {name, secondName, role} = yield take(CREATE_PROFILE_ACTION);
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
    yield put(setToken(cleanUpToken));
  } catch (error) {
    console.log(error);
    setErrorMessage(String(error));
        //  if (error.code && error.code === 'AUTH_ACCOUNT_IS_LOCKED') {
        //      yield put(setErrorMessage(strings.label_locked_account_warning));
        //  } else {
        //      yield put(setErrorMessage(String(error)));
        // }
  }
}

export function* loginFacebookFlow() {
  console.log('loginFacebookFlow')
  while (true) {
    yield take(FB_LOGIN_ACTION);
    yield call(loginFacebook);


        // const {name, secondName, role} = yield take(CREATE_PROFILE_ACTION);
        // yield put(rootActions.controlProgress(true));
        // yield call(createProfile, name, secondName, role);
        // yield put(rootActions.controlProgress(false));
  }
}
