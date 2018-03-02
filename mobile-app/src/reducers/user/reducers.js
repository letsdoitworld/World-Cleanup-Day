//import { combineReducers } from 'redux';

import types from './types';

export const authInitialState = {
    token: undefined,
    tokenError: undefined,
    termsAgreed: false,
};

export const profileInitialState = {
    entity: undefined,
    loading: false,
    updating: false,
    updatingError: undefined,
    error: undefined,
};

export const profileStatusInitialState = {
    status: false,
    error: undefined,
};

export const authReducer = (state, action = {}) => {
    switch (action.type) {
        case types.SET_AUTH_TOKEN:
            return state.withMutations(state => state
                .set('token', action.payload)
            );
        case types.SET_AUTH_ERROR:
            return state.withMutations(state => state
                .set('tokenError', String(action.payload))
            );
        case types.REMOVE_AUTH_TOKEN:
            return state.withMutations(state => state
                .set('token', undefined)
            );
        default:
            return state;
    }
};

export const profileReducer = (state, action = {}) => {
    switch (action.type) {
        // case types.TERMS_AGREE:
        //     //TODO: change to immutable
        //     return {
        //         ...state,
        //         entity: {
        //             ...state.entity,
        //             termsAcceptedAt: true,
        //         },
        //     };
        case types.FETCH_PROFILE:
            return state.withMutations(state => state
                .set('loading', true));
        case types.FETCH_PROFILE_SUCCESS:
            console.log('Payload', action.payload);
            return state.withMutations(state => state
                .set('entity', action.payload));
        case types.FETCH_PROFILE_ERROR:
            return state.withMutations(state => state
                .set('error', action.payload));

        // case types.UPDATE_PROFILE:
        //     //TODO: change to immutable
        //     return {
        //         ...state,
        //         updating: true,
        //         updatingError: undefined,
        //     };
        // case types.UPDATE_PROFILE_DONE:
        //     //TODO: change to immutable
        //     return {
        //         ...state,
        //         updating: false,
        //         updatingError: undefined,
        //         entity: action.payload,
        //     };
        // case types.UPDATE_PROFILE_ERROR:
        //     //TODO: change to immutable
        //     return {
        //         ...state,
        //         updating: false,
        //         updatingError: action.payload,
        //     };

        default:
            return state;
    }
};

export const profileStatusReducer = (state, action = {}) => {
    switch (action.type) {
        case types.UPDATE_PROFILE_STATUS_ACTION:
            return state.withMutations(state => state
                .set('status', action.payload)
            );
        case types.UPDATE_PROFILE_STATUS_ERROR:
            return state.withMutations(state => state
                .set('error', String(action.payload))
            );
        default:
            return state;
    }
};