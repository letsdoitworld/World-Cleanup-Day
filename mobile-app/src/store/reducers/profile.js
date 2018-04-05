import Immutable from 'immutable';

import concat from 'lodash/concat';

import { createReducer } from '../helpers/createReducer';

import { LOGOUT } from '../actions/auth';

import {
    TERMS_AGREE,
    FETCH_PROFILE,
    FETCH_PROFILE_SUCCESS,
    FETCH_PROFILE_ERROR,
    UPDATE_PROFILE,
    UPDATE_PROFILE_DONE,
    UPDATE_PROFILE_ERROR,
    UPDATE_PROFILE_EMAIL,
    UPDATE_PROFILE_STATUS_SUCCESS,
    LOAD_MY_EVENTS_SUCCESS,
    LOAD_MY_EVENTS_ERROR,
    LOAD_MY_TRASH_POINTS_SUCCESS,
    LOAD_MY_TRASH_POINTS_ERROR,
    LOAD_MY_EVENTS_PAGINATION_SUCCESS,
    LOAD_MY_TRASH_POINTS_PAGINATION_SUCCESS,
} from '../actions/profile';


export const initialState = Immutable.Map(
  {
    entity: null,
    loading: false,
    updating: false,
    updatingError: null,
    error: null,
    myEvents: null,
    myEventsError: null,
    myTrashPoints: null,
    myTrashPointsError: null,
  },
);

const handlers = {
  [LOGOUT]: () => initialState,

  [TERMS_AGREE]: (state) => {
    return state.withMutations(mState =>
            mState.set('entity', {
              ...state.entity,
              termsAcceptedAt: true,
            }),
        );
  },
  [UPDATE_PROFILE_EMAIL]: (state, { payload }) => {
    return state.withMutations(mState =>
            mState.set('entity', {
              ...state.get('entity'),
              email: payload,
            }),
        );
  },
  [UPDATE_PROFILE_STATUS_SUCCESS]: (state, { payload }) => {
    return state.withMutations(mState =>
            mState.set('entity', {
              ...state.get('entity'),
              public: payload,
            }),
        );
  },
  [FETCH_PROFILE]: (state) => {
    return state.withMutations(mState =>
            mState.set('loading', true));
  },
  [FETCH_PROFILE_SUCCESS]: (state, { payload }) => {
    return state.withMutations(mState =>
            mState.set('entity', {
              ...state.get('entity'),
              ...payload,
            }),
        );
  },
  [FETCH_PROFILE_ERROR]: (state, { payload }) => {
    return state.withMutations(mState =>
            mState.set('error', payload));
  },
  [UPDATE_PROFILE]: (state) => {
    return state.withMutations(mState =>
            mState.set('updating', true));
  },
  [UPDATE_PROFILE_DONE]: (state, { payload }) => {
    return state.withMutations(mState =>
            mState
                .set('updating', false)
                .set('updatingError', null)
                .set('entity', payload),
        );
  },
  [UPDATE_PROFILE_ERROR]: (state, { payload }) => {
    return state.withMutations(mState =>
            mState
                .set('updating', false)
                .set('updatingError', payload),
        );
  },
  [LOAD_MY_EVENTS_SUCCESS]: (state, { payload }) => {
    return state.withMutations(mState =>
            mState.set('myEvents', {
              ...state.get('myEvents'),
              ...payload,
            }),
        );
  },
  [LOAD_MY_EVENTS_PAGINATION_SUCCESS]: (state, { payload }) => {
    const myEvents = state.get('myEvents');
    return state.withMutations(mState =>
            mState.set('myEvents', {
              ...myEvents,
              ...payload,
              listMyEvents: concat(myEvents.listMyEvents, payload.listMyEvents),
            }),
        );
  },
  [LOAD_MY_EVENTS_ERROR]: (state, { payload }) => {
    return state.withMutations(mState =>
            mState.set('myEventsError', payload));
  },
  [LOAD_MY_TRASH_POINTS_SUCCESS]: (state, { payload }) => {
    return state.withMutations(mState =>
        mState.set('myTrashPoints', {
          ...state.get('myTrashPoints'),
          ...payload,
        }),
    );
  },
  [LOAD_MY_TRASH_POINTS_PAGINATION_SUCCESS]: (state, { payload }) => {
    return state.withMutations(mState =>
            mState.set('myTrashPoints', {
              ...state.get('myTrashPoints'),
              ...payload,
              listMyTrashPoints: concat(state.get('myTrashPoints').listMyTrashPoints, payload.listMyTrashPoints),
            }),
        );
  },
  [LOAD_MY_TRASH_POINTS_ERROR]: (state, { payload }) => {
    return state.withMutations(mState =>
            mState.set('myTrashPointsError', payload));
  },
};

export default createReducer(initialState, handlers);
