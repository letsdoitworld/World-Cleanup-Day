import { fetchNetworkTokenAsync, SOCIAL_NETWORKS } from '../../services/Login';
import Api from '../../services/Api';
import actions from './actions';
import { operations as appOps } from '../app';
import i18n from '../../config/i18n';
import {handleSentryError} from '../../shared/helpers';

const googleLogin = () => async (dispatch) => {
  try {
    let token;
    // const token = 'ex_token';
    // dispatch(actions.setToken(token));
    // return token;
    try {
      token = await fetchNetworkTokenAsync(SOCIAL_NETWORKS.GOOGLE);
    } catch (ex) {
      handleSentryError(ex);
      if (ex.code && ex.code === 'AUTH_ACCOUNT_IS_LOCKED') {
        dispatch(
          appOps.setErrorMessage(i18n.t('label_locked_account_warning')),
        );
      }
      return;
    }
    dispatch(actions.setToken(token));
    return token;
  } catch (ex) {
    handleSentryError(ex);
    dispatch(actions.setAuthError(ex));
    throw ex;
  }
};
const facebookLogin = () => async (dispatch) => {
  try {
    let token;
    // const token = 'ex_token';
    // dispatch(actions.setToken(token));
    // return token;
    try {
      token = await fetchNetworkTokenAsync(SOCIAL_NETWORKS.FACEBOOK);
    } catch (ex) {
      handleSentryError(ex);
      if (ex.code && ex.code === 'AUTH_ACCOUNT_IS_LOCKED') {
        dispatch(
          appOps.setErrorMessage(i18n.t('label_locked_account_warning')),
        );
      }
      return;
    }

    dispatch(actions.setToken(token));
    return token;
  } catch (ex) {
    handleSentryError(ex);
    dispatch(actions.setAuthError(ex));
    throw ex;
  }
};
const getProfile = () => async (dispatch) => {
  dispatch(actions.fetchProfile());

  try {
    const response = await Api.get('/me');
    dispatch(actions.fetchProfileDone(response.data));
    return response.data;
  } catch (ex) {
    handleSentryError(ex);
    dispatch(actions.fetchProfileError(ex));
    throw ex;
  }
};

const updateProfile = profile => async (dispatch) => {
  dispatch(actions.updateProfile());

  try {
    const response = await Api.put('/me', profile);
    if (!response || !response.data) {
      throw { error: 'Could not not read response data' };
    }
    dispatch(actions.updateProfileDone(response.data));
    return response.data;
  } catch (ex) {
    handleSentryError(ex);
    dispatch(actions.updateProfileError(ex));
  }
};

const logout = () => async (dispatch) => {
  try {
    await Api.delete('/auth', { skipError: true });
  } catch (ex) {
    handleSentryError(ex);
    console.log(ex);
  }
  dispatch(actions.removeToken());
};

const agreeToTerms = () => async (dispatch) => {
  const response = await Api.put(
    '/me/accept-terms',
    {},
    { withToken: true },
    {
      'Content-Type': 'application/json',
    },
  );
  if (response && response.status === 200) {
    dispatch(actions.agreeToTerms());
  }
  return true;
};

export default {
  facebookLogin,
  googleLogin,
  logout,
  agreeToTerms,
  getProfile,
  updateProfile,
};
