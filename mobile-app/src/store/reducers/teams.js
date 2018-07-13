import Immutable from 'immutable';
import { createReducer } from '../helpers/createReducer';
import {
  FETCH_TEAMS,
  FETCH_TEAMS_ERROR,
  FETCH_TEAMS_SUCCESS,
  FETCH_TEAM,
  FETCH_TEAM_SUCCESS,
  FETCH_TEAM_ERROR,
} from '../actions/teams';

export const initialState = Immutable.Map(
  {
    teams: null,
    loading: false,
    team: null,
    error: null,
  },
);

const handlers = {
  [FETCH_TEAMS]: (state) => {
    return state.withMutations(mState =>
      mState.set('loading', true));
  },
  [FETCH_TEAMS_SUCCESS]: (state, { payload }) => {
    return state.withMutations((mState) => {
      mState.set('teams', payload);
      mState.set('loading', false);
    });
  },
  [FETCH_TEAMS_ERROR]: (state, { payload }) => {
    return state.withMutations((mState) => {
      mState.set('error', payload);
      mState.set('loading', false);
    });
  },
  [FETCH_TEAM]: (state, { payload }) => {
    return state.withMutations((mState) => {
      mState.set('loading', true);
    });
  },
  [FETCH_TEAM_SUCCESS]: (state, { payload }) => {
    return state.withMutations((mState) => {
      mState.set('team', payload);
      mState.set('loading', false);
    });
  },
  [FETCH_TEAM_ERROR]: (state, { payload }) => {
    return state.withMutations((mState) => {
      mState.set('error', payload);
      mState.set('loading', false);
    });
  },
};

export default createReducer(initialState, handlers);
