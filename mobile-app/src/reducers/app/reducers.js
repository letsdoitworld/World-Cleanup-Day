import types from './types';

export const popoverInitialState = {
    shown: false,
    message: 'Join other people who are mapping trash!',
};

export const errorInitialState = {
    visible: false,
    title: undefined,
    message: undefined,
};

export const networkStatusState = {
    isConnected: false,
    connectionChecked: false,
};

export const progressInitialState = {
    progress: undefined,
};

export const networkReducer = (state, action = {}) => {
    //todo: migrate to immutable
    switch (action.type) {
        case types.SET_CONNECTION_CHECKED:
            return {...state, connectionChecked: true};
        case types.UPDATE_NETWORK_STATUS:
            return {...state, isConnected: action.payload.isConnected};
        default:
            return state;
    }
};

export const popoverReducer = (state, action={}) => {
    //todo: migrate to immutable
    switch (action.type) {
        case types.SET_POPOVER_SHOWN:
            return {...state, shown: true};
        case types.SET_POPOVER_MESSAGE:
            return {...state, message: action.payload};
        default:
            return state;
    }
};

export const errorReducer = (state, action={}) => {
    //todo: migrate to immutable
    switch (action.type) {
        case types.SET_ERROR_MESSAGE:
            return {...state, ...action.payload, visible: true};
        case types.HIDE_ERROR_MESSAGE:
            return {...state, visible: false};
        default:
            return state;
    }
};

export const progressReducer = (state, action={}) => {
    switch (action.type) {
        case types.PROGRESS_ACTION:
            return state.withMutations(state => state
                .set('progress', action.progress)
            );
        default:
            return state;
    }
};

export const configReducer = (state, action={},) => {
    //todo: migrate to immutable
    switch (action.type) {
        case types.FETCH_DATASETS_REQUEST:
            return {...state, loading: true};
        case types.FETCH_DATASETS_SUCCESS:
            return {
                ...state,
                loading: false,
                trashpointsDatasetUUID: action.trashpointsDatasetUUID,
            };
        case types.FETCH_DATASETS_FAILED:
            return {...state, loading: false};
        case types.SET_ACTIVE_SCREEN:
            return {...state, activeScreen: action.activeScreen};
        default:
            return state;
    }
};


