import axios from 'axios';
import _ from 'lodash';

import ApiService, { BASE_URL } from '../services/Api';
import { API_ENDPOINTS, USER_ROLES } from '../shared/constants';
import { actions as appActions } from './app';

export const TYPES = {
  SET_AUTH_TOKEN: 'SET_AUTH_TOKEN',
  REMOVE_AUTH_TOKEN: 'REMOVE_AUTH_TOKEN',
  SET_PROFILE: 'SET_PROFILE',
  LOGOUT: 'LOGOUT',
  AGREE_TO_TERMS: 'AGREE_TO_TERMS',
};

const authInitialState = {
  token: undefined,
  profile: { role: '' },
};

const authReducer = (state = authInitialState, action) => {
  switch (action.type) {
    case TYPES.SET_AUTH_TOKEN:
      return { ...state, token: action.token };
    case TYPES.LOGOUT:
      return { ...state, token: undefined, profile: authInitialState.profile };
    case TYPES.SET_PROFILE:
      return { ...state, profile: action.profile };
    case TYPES.AGREE_TO_TERMS:
      return {
        ...state,
        profile: {
          ...state.profile,
          termsAcceptedAt: true,
        },
      };
    default:
      return state;
  }
};

const authenticate = ({ network, token }) => async (dispatch, getState) => {
  try {
    let authError = false;
    let response;
    try {
      response = await axios.post(`${BASE_URL}${API_ENDPOINTS.USER_AUTH}`, {
        source: network,
        token,
      });
    } catch (ex) {
      authError = true;
      response = ex.response;
    }
    if (authError) {
      if (
        response.data &&
        _.isArray(response.data) &&
        response.data.length > 0
      ) {
        const error = response.data[0];
        if (error.code && error.code === 'AUTH_ACCOUNT_IS_LOCKED') {
          dispatch(appActions.toggleLockedModal(true));
        }
      }
      return;
    }

    const networkToken = response.data.token;
    ApiService.setAuthToken(networkToken);
    dispatch(setAuthToken(networkToken));
    dispatch(fetchProfile()).then(profile => {
      if (!profile) {
        return;
      }
      if (profile.locked) {
        console.log('Account is locked');
        return;
      }
      if (!isAllowedRole(getState())) {
        dispatch(logout());
        dispatch(appActions.showModal());
      }
    });
  } catch (e) {
    console.log(e);
  }
};

const fetchProfile = () => async dispatch => {
  const profileData = await ApiService.get(API_ENDPOINTS.USER_ME);
  if (!profileData || !profileData.data) {
    dispatch(logout());
  } else {
    dispatch(setProfile(profileData.data));
    return profileData.data;
  }
};

const setAuthToken = token => ({
  type: TYPES.SET_AUTH_TOKEN,
  token,
});

const setProfile = profile => ({ type: TYPES.SET_PROFILE, profile });

const logout = () => async dispatch => {
  await ApiService.delete('/auth');
  dispatch({ type: TYPES.LOGOUT });
};

const agreeToTerms = () => async dispatch => {
  const response = await ApiService.put(
    '/me/accept-terms',
    {},
    { withToken: true },
    {
      'Content-Type': 'application/json',
    },
  );
  if (response && response.status === 200) {
    dispatch({ type: TYPES.AGREE_TO_TERMS });
  }
  return true;
};

export const actions = {
  setAuthToken,
  authenticate,
  logout,
  fetchProfile,
  agreeToTerms,
};

const getUserState = state => state.user;
const getUserToken = state => getUserState(state).token;
const getProfile = state => getUserState(state).profile;
const getRole = state => getProfile(state).role;
const isSuperAdmin = state => getRole(state) === USER_ROLES.SUPERADMIN;
const isAllowedRole = state => {
  const role = getRole(state);
  return role === USER_ROLES.SUPERADMIN || role === USER_ROLES.LEADER || role === USER_ROLES.VOLUNTEER;
};
const isAreaLeader = state => getRole(state) === USER_ROLES.LEADER;

export const selectors = {
  getUserToken,
  getProfile,
  getRole,
  isSuperAdmin,
  isAllowedRole,
  isAreaLeader
};

export default authReducer;
