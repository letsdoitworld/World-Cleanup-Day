import {fetchNetworkTokenAsync, SOCIAL_NETWORKS} from '../../services/Login';
import Api from '../../services/Api';
import actions from './actions';
//import { operations as appOps } from '../app';

const FBSDK = require('react-native-fbsdk');
const {
    LoginManager,
    AccessToken
} = FBSDK;

const googleLogin = () => async (dispatch) => {
    try {
        let token;
        // const token = 'ex_token';
        // dispatch(actions.setToken(token));
        // return token;
        try {
            token = await fetchNetworkTokenAsync(SOCIAL_NETWORKS.GOOGLE);
        } catch (ex) {
            if (ex.code && ex.code === 'AUTH_ACCOUNT_IS_LOCKED') {
                // dispatch(
                //   appOps.setErrorMessage(i18n.t('label_locked_account_warning')),
                // );
            }
            return;
        }
        dispatch(actions.setToken(token));
        return token;
    } catch (ex) {
        dispatch(actions.setAuthError(ex));
        throw ex;
    }
};


export function facebookLogin() {
    return LoginManager.logInWithReadPermissions(['public_profile'])
        .then((result) => {
            if (result.isCancelled) {
                throw 'Login cancelled';
            } else {
                return AccessToken.getCurrentAccessToken()
            }
        }).then((token) => {
            return token;
        }).catch((error) => {
            return error
        })
}

//const facebookLogin = () => async (dispatch) => {
// try {
//   let token;
//   // const token = 'ex_token';
//   // dispatch(actions.setToken(token));
//   // return token;
//   try {
//     token = await fetchNetworkTokenAsync(SOCIAL_NETWORKS.FACEBOOK);
//   } catch (ex) {
//     if (ex.code && ex.code === 'AUTH_ACCOUNT_IS_LOCKED') {
//       // dispatch(
//       //   appOps.setErrorMessage(i18n.t('label_locked_account_warning')),
//       // );
//     }
//     return;
//   }
//
//   dispatch(actions.setToken(token));
//   return token;
// } catch (ex) {
//   dispatch(actions.setAuthError(ex));
//   throw ex;
// }


// LoginManager.logInWithReadPermissions(['public_profile']).then(
//     function(result) {
//         if (result.isCancelled) {
//             alert('Login cancelled');
//         } else {
//             AccessToken.getCurrentAccessToken().then(
//                 (data) => {
//                     alert(data.accessToken.toString())
//                 }
//             );
//         }
//     },
//     function(error) {
//         console.warn(error);
//         console.warn('error');
//         alert('Login fail with error: ' + error);
//     }
// )

//};

const getProfile = () => async (dispatch) => {
    dispatch(actions.fetchProfile());

    try {
        const response = await Api.get('/me');

        dispatch(actions.fetchProfileDone(response.data));
        return response.data;
    } catch (ex) {
        dispatch(actions.fetchProfileError(ex));
        throw ex;
    }
};

const updateProfile = profile => async (dispatch) => {
    dispatch(actions.updateProfile());

    try {
        const response = await Api.put('/me', profile);
        if (!response || !response.data) {
            throw {error: 'Could not not read response data'};
        }
        dispatch(actions.updateProfileDone(response.data));
        return response.data;
    } catch (ex) {
        dispatch(actions.updateProfileError(ex));
    }
};

const logout = () => async (dispatch) => {
    try {
        await Api.delete('/auth', {skipError: true});
    } catch (ex) {
        console.log(ex);
    }
    dispatch(actions.removeToken());
};

const agreeToTerms = () => async (dispatch) => {
    const response = await Api.put(
        '/me/accept-terms',
        {},
        {withToken: true},
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
//  facebookLogin,
    googleLogin,
    logout,
    agreeToTerms,
    getProfile,
    updateProfile,
};
