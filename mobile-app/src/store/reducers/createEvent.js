import Immutable from 'immutable';

import { createReducer } from '../helpers/createReducer';

import {
    CREATE_EVENT_ACTION,
    CREATE_EVENT_ERROR,
    CREATE_EVENT_SUCCESS,
} from '../actions/createEvent';


export const initialState = Immutable.Map(
    {
        event: null,
        loading: false,
        error: null,
    },
);


const handlers = {
    [CREATE_EVENT_ACTION]: (state) => {
        return state.withMutations(mState =>
            mState
                .set('loading', true));
    },
    [CREATE_EVENT_SUCCESS]: (state, {event}) => {
        return state.withMutations(mState =>
            mState
                .set('loading', false)
                .set('event', event));
    },
    [CREATE_EVENT_ERROR]: (state, { payload }) => {
        return state.withMutations(mState =>
            mState.set('error', payload));
    },
};

export default createReducer(initialState, handlers);
