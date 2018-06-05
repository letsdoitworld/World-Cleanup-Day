import { call, put, take, select } from 'redux-saga/effects';
import has from 'lodash/has';
import {
  getToken,
  getTerms,
  isGuestSession,
} from '../selectors';

import {
  setErrorMessage,
  hideErrorMessage,
} from '../actions/error';

import {
  FB_LOGIN_ACTION,
  GOOGLE_LOGIN_ACTION,
  REQUEST_TERMS_ACCEPT,
  REHYDRATE,
  LOGOUT,
  setToken,
  logout,
  setTerms,
} from '../actions/auth';

import {
  updateEmailProfile,
} from '../actions/profile';
import { FACEBOOK_CANCEL_LOGIN,
  GOOGLE_CANCEL_LOGIN, IOS_GOOGLE_CANCEL_LOGIN } from '../../shared/constants';
import Api from '../../api';

import ApiConfig from '../../services/Api';

import {
  login,
  BACKEND_LOGIN_SOURCES,
} from '../../services/Login';

const FBSDK = require('react-native-fbsdk');

const { LoginManager } = FBSDK;

function* autoRegidrate() {
  try {
    const token = yield select(getToken);
    const terms = yield select(getTerms);
    const guest = yield select(isGuestSession);
    yield put(hideErrorMessage());
    if (token) {
      yield ApiConfig.setAuthToken(token);
    }

    if (terms) {
      yield put(setTerms(terms));
    } else if (!guest && token) {
      yield put(logout());
    }
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}

function* reqTerms() {
  try {
    yield call(Api.auth.agreeToTerms);
    yield put(setTerms(true));
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}
export function* requestTermsFlow() {
  while (true) {
    yield take(REQUEST_TERMS_ACCEPT);
    yield call(reqTerms);
  }
}
export function* autoRegidrateFlow() {
  while (true) {
    yield take(REHYDRATE);
    yield call(autoRegidrate);
  }
}

function* loginGoogle() {
  try {
    const user = yield call(Api.auth.googleLogin);
    const accessToken = user.accessToken;
    const cleanUpToken = yield call(login, BACKEND_LOGIN_SOURCES.GOOGLE, accessToken);
    const profile = yield call(Api.profile.getProfile);
    const accept = has(profile, 'termsAcceptedAt');
    yield put(setTerms(accept));
    yield put(setToken(cleanUpToken));
    yield call(ApiConfig.setAuthToken, cleanUpToken);
  } catch (error) {
    switch (error.code) {
      case GOOGLE_CANCEL_LOGIN:
        break;
      case IOS_GOOGLE_CANCEL_LOGIN:
        break;
      default:
        yield put(setErrorMessage(error.message));
    }
  }
}

export function* loginGoogleFlow() {
  while (true) {
    yield take(GOOGLE_LOGIN_ACTION);
    yield call(loginGoogle);
  }
}

function* loginFacebook() {
  try {
    const res = yield call(Api.auth.facebookLogin);
    const accessToken = res.token.accessToken;
    const cleanUpToken = yield call(login, BACKEND_LOGIN_SOURCES.FACEBOOK, accessToken);
    const profile = yield call(Api.profile.getProfile);
    const accept = has(profile, 'termsAcceptedAt');
    yield put(setTerms(accept));
    yield put(setToken(cleanUpToken));
    yield call(ApiConfig.setAuthToken, cleanUpToken);
    if (res.email) {
      yield put(updateEmailProfile(res.email));
    }
  } catch (error) {
    switch (error.message) {
      case FACEBOOK_CANCEL_LOGIN:
        break;
      default:
        yield put(setErrorMessage(error.message));
    }
  }
}

export function* loginFacebookFlow() {
  while (true) {
    yield take(FB_LOGIN_ACTION);
    yield call(loginFacebook);
  }
}


function* logoutUser() {
  try {
    yield call(Api.auth.logout);
    yield call(LoginManager.logOut);
    yield put(logout());
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}

export function* logoutFlow() {
  while (true) {
    yield take(LOGOUT);
    yield call(logoutUser);
  }
}
