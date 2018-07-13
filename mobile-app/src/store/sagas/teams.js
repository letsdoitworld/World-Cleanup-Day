import { call, put, take } from 'redux-saga/effects';

import { setErrorMessage } from '../actions/error';

import {
  FETCH_TEAMS,
  fetchTeamsDone,
  FETCH_TEAM,
  fetchTeamDone,
} from '../actions/teams';

import Api from '../../api';

function* loadTeams(search) {
  try {
    const response = yield call(Api.teams.getTeams, search);
    yield put(fetchTeamsDone(response));
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}

export function* loadTeamsFlow() {
  while (true) {
    const { payload } = yield take(FETCH_TEAMS);
    yield call(loadTeams, payload);
  }
}

function* loadTeam(teamId) {
  try {
    const response = yield call(Api.teams.getTeam, teamId);
    yield put(fetchTeamDone(response));
  } catch (error) {
    yield put(setErrorMessage(error.message));
  }
}

export function* loadTeamFlow() {
  while (true) {
    const { payload } = yield take(FETCH_TEAM);
    yield call(loadTeam, payload);
  }
}
