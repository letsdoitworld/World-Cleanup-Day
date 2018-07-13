import Immutable from 'immutable';

import {
  LOAD_EVENT_SUCCESS,
  CLEAN_EVENT,
  LOAD_EVENTS_ERROR,
} from '../types/events';

import {
  SEARCH_EVENTS_SUCCESS_ACTION,
  CLEAR_EVENTS_ACTION,
  LOAD_EVENTS_FOR_MAP_SUCCESS,
  LOAD_EVENTS_FOR_MAP_ERROR,
  SHOW_NEW_DELTA,
  IS_EVENTS_EMPTY,
  CHANGE_VIEW_PROT_ACTION,
  CHANGE_REGION_ACTION,
  DELETE_EVENT_ACTION_SUCCESS,
} from '../actions/events';

import { LOGOUT } from '../actions/auth';

import { createReducer } from '../helpers/createReducer';

export const initialState = Immutable.Map(
  {
    events: null,
    errors: null,
    currentEvent: null,
    mapEvents: undefined,
    newDelta: undefined,
    empty: false,
    viewPort: undefined,
    searchCount: 0,
    updatedRegion: undefined,
  });

const handlers = {
  [LOGOUT]: () => initialState,

  [SEARCH_EVENTS_SUCCESS_ACTION]: (state, { payload }) => {
    if (payload.page > 0) {
      const currentEvents = state.get('events');
      if (currentEvents) {
        return state.withMutations(mState => mState
          .set('events', currentEvents.concat(payload.events)));
      }
      return state;
    }
    return state.withMutations(mState => mState
      .set('events', payload.events));
  },
  [CLEAR_EVENTS_ACTION]: (state) => {
    return state.withMutations(mState => mState
      .set('events', undefined),
    );
  },
  [LOAD_EVENT_SUCCESS]: (state, { payload }) => {
    return state.withMutations(mState =>
      mState.set('currentEvent', {
        ...payload,
      }),
    );
  },
  [LOAD_EVENTS_ERROR]: (state, { payload }) => {
    return state.withMutations(mState =>
      mState.set('errors', {
        errorEvent: payload,
      }),
    );
  },
  [CLEAN_EVENT]: (state) => {
    return state.withMutations(mState =>
      mState.set('currentEvent', null),
    );
  },
  [DELETE_EVENT_ACTION_SUCCESS]: (state) => {
    return state.withMutations(mState =>
      mState.set('currentEvent', null),
    );
  },
  [LOAD_EVENTS_FOR_MAP_SUCCESS]: (state, { payload }) => {
    const currentCount = state.get('searchCount');
    return state.withMutations((mState) => {
      mState.set('mapEvents', payload);
      mState.set('searchCount', currentCount + 1);
    });
  },
  [LOAD_EVENTS_FOR_MAP_ERROR]: (state, { payload }) => {
    return state.withMutations(mState => mState
      .set('error', payload));
  },
  [SHOW_NEW_DELTA]: (state, { payload }) => {
    return state.withMutations(mState => mState
      .set('newDelta', payload));
  },
  [IS_EVENTS_EMPTY]: (state, { payload }) => {
    return state.withMutations(mState => mState
      .set('empty', payload));
  },
  [CHANGE_VIEW_PROT_ACTION]: (state, { payload }) => {
    return state.withMutations(mState => mState
      .set('viewPort', payload));
  },
  [CHANGE_REGION_ACTION]: (state, { payload }) => {
    return state.withMutations(mState => mState
      .set('updatedRegion', payload));
  },
};

export default createReducer(initialState, handlers);
