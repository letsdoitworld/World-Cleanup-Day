import Immutable from 'immutable';

import concat from 'lodash/concat';

import { createReducer } from '../helpers/createReducer';

import { LOGOUT } from '../actions/auth';

import {
  FETCH_PROFILE,
  FETCH_PROFILE_ERROR,
  FETCH_PROFILE_SUCCESS,
  LOAD_MY_EVENTS_ACTION,
  LOAD_MY_EVENTS_ERROR,
  LOAD_MY_EVENTS_PAGINATION_SUCCESS,
  LOAD_MY_EVENTS_SUCCESS,
  LOAD_MY_TRASH_POINTS_ACTION,
  LOAD_MY_TRASH_POINTS_ERROR,
  LOAD_MY_TRASH_POINTS_PAGINATION_SUCCESS,
  LOAD_MY_TRASH_POINTS_SUCCESS,
  TERMS_AGREE,
  UPDATE_PROFILE,
  UPDATE_PROFILE_DONE,
  UPDATE_PROFILE_EMAIL,
  UPDATE_PROFILE_ERROR,
  UPDATE_PROFILE_STATUS_SUCCESS,
  UPDATE_PROFILE_TEAM,
  UPDATE_PROFILE_TEAM_ERROR,
  UPDATE_PROFILE_TEAM_SUCCESS,
} from '../actions/profile';
import {
  DELETE_TRASH_POINT_SUCCESS_ACTION,
  UPDATE_TRASH_POINT_SUCCESS_ACTION,
} from '../types/trashPoints';


export const initialState = Immutable.Map(
  {
    entity: null,
    loading: false,
    updating: false,
    updatingError: null,
    error: null,
    myEvents: null,
    myEventsError: null,
    myEventsLoading: false,
    myTrashPoints: null,
    myTrashPointsError: null,
    myTrashPointsLoading: false,
  },
);

function removeTrashPoint(trashPoints, trashPointId) {
  const updatedTrashPoints = trashPoints.listMyTrashPoints;
  if (!updatedTrashPoints) {
    return trashPoints.listMyTrashPoints;
  }
  const removedIndex = updatedTrashPoints
    .findIndex(trashPoint => trashPointId === trashPoint.id);
  updatedTrashPoints.splice(removedIndex, 1);

  return updatedTrashPoints;
}


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
  [UPDATE_PROFILE_TEAM]: (state) => {
    return state.withMutations(mState =>
      mState.set('updating', true));
  },
  [UPDATE_PROFILE_TEAM_SUCCESS]: (state, { payload }) => {
    return state.withMutations(mState =>
      mState
        .set('updating', false)
        .set('updatingError', null)
        .set('entity', payload),
    );
  },
  [UPDATE_PROFILE_TEAM_ERROR]: (state, { payload }) => {
    return state.withMutations(mState =>
      mState
        .set('updating', false)
        .set('updatingError', payload),
    );
  },
  [LOAD_MY_EVENTS_ACTION]: (state) => {
    return state.withMutations(mState =>
      mState.set('myEventsLoading', true),
    );
  },
  [LOAD_MY_EVENTS_SUCCESS]: (state, { payload }) => {
    return state.withMutations(mState =>
      mState
        .set('myEvents', {
          ...state.get('myEvents'),
          ...payload,
        })
        .set('myEventsLoading', false),
    );
  },
  [LOAD_MY_EVENTS_PAGINATION_SUCCESS]: (state, { payload }) => {
    const myEvents = state.get('myEvents');
    return state.withMutations(mState =>
      mState
        .set('myEvents', {
          ...myEvents,
          ...payload,
          listMyEvents: concat(myEvents.listMyEvents, payload.listMyEvents),
        })
        .set('myEventsLoading', false),
    );
  },
  [LOAD_MY_EVENTS_ERROR]: (state, { payload }) => {
    return state.withMutations(mState =>
      mState
        .set('myEventsError', payload)
        .set('myEventsLoading', false),
    );
  },
  [LOAD_MY_TRASH_POINTS_ACTION]: (state) => {
    return state.withMutations(mState =>
      mState.set('myTrashPointsLoading', true),
    );
  },
  [LOAD_MY_TRASH_POINTS_SUCCESS]: (state, { payload }) => {
    return state.withMutations(mState =>
      mState
        .set('myTrashPoints', {
          ...state.get('myTrashPoints'),
          ...payload,
        })
        .set('myTrashPointsLoading', false),
    );
  },
  [LOAD_MY_TRASH_POINTS_PAGINATION_SUCCESS]: (state, { payload }) => {
    return state.withMutations(mState =>
      mState
        .set('myTrashPoints', {
          ...state.get('myTrashPoints'),
          ...payload,
          listMyTrashPoints: concat(state.get('myTrashPoints')
            .listMyTrashPoints, payload.listMyTrashPoints),
        })
        .set('myTrashPointsLoading', false),
    );
  },
  [LOAD_MY_TRASH_POINTS_ERROR]: (state, { payload }) => {
    return state.withMutations(mState =>
      mState
        .set('myTrashPointsError', payload)
        .set('myTrashPointsLoading', false),
    );
  },
  [DELETE_TRASH_POINT_SUCCESS_ACTION]: (state, { payload }) => {
    const { id } = payload;
    const currentTrashPoints = removeTrashPoint(state.get('myTrashPoints'), id);

    return state.withMutations(mState => mState
      .set('myTrashPoints', {
        ...state.get('myTrashPoints'),
        listMyTrashPoints: currentTrashPoints,
      }),
    );
  },
  [UPDATE_TRASH_POINT_SUCCESS_ACTION]: (state, { payload }) => {
    const myTrashPointsState = state.get('myTrashPoints');
    if (myTrashPointsState && myTrashPointsState != null) {
      const myTrashPoints = myTrashPointsState.listMyTrashPoints;
      if (myTrashPoints && myTrashPoints != null) {
        const updatedTrashpoint = myTrashPoints
          .find(trashpoint => trashpoint.id === payload.id);
        const updatedIndex = myTrashPoints.indexOf(updatedTrashpoint);
        myTrashPoints[updatedIndex] = payload;
        return state.withMutations(mState => mState
          .set('myTrashPoints', myTrashPoints),
        );
      }
    }
    return state;
  }
  ,
};

export default createReducer(initialState, handlers);
