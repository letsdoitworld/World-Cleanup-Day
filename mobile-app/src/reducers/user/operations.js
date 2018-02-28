import {fetchNetworkTokenAsync, SOCIAL_NETWORKS} from '../../services/Login';
import Api from '../../services/Api';
import actions from './actions';
import {GoogleSignin} from "react-native-google-signin";
//import { operations as appOps } from '../app';

const FBSDK = require('react-native-fbsdk');
const {
    LoginManager,
    AccessToken
} = FBSDK;

export function googleLogin() {
    return GoogleSignin.configure({
        scopes: ["https://www.googleapis.com/auth/drive.readonly"],
        //  iosClientId: <FROM DEVELOPER CONSOLE>, // only for iOS
        webClientId: '343042629555-168fin9loioa94ttsudsi1lptea79l4b.apps.googleusercontent.com',
        offlineAccess: false
    })
        .then(() => {
            return GoogleSignin.signIn()
        })
        .catch((error) => {
            console.log(error)
        })
}

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
